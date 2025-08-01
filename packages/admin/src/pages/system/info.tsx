// SPDX-FileCopyrightText: 2024-2025 caixw
//
// SPDX-License-Identifier: MIT

import {
    AxisChart, AxisRef, ConfirmButton, createBytesFormatter, Divider, joinClass, Label, Page, Tab
} from '@cmfx/components';
import {
    createEffect, createMemo, createResource, createSignal, For, JSX, onCleanup, onMount
} from 'solid-js';
import IconAction from '~icons/material-symbols/action-key';
import IconBackup from '~icons/material-symbols/backup';
import IconClear from '~icons/material-symbols/clear-all';
import IconDatabase from '~icons/material-symbols/database';
import IconDataset from '~icons/material-symbols/dataset';
import IconInfo from '~icons/material-symbols/info';
import IconChart from '~icons/material-symbols/ssid-chart';

import { use, useLocale } from '@/context';
import styles from './style.module.css';

const mb = 1024 * 1024;

export function Info(): JSX.Element {
    const [api, act] = use();
    const l = useLocale();
    const bytesFormatter = createMemo(() => createBytesFormatter(l));

    const [info] = createResource(async()=>{
        const ret = await api.get<Info>('/system/info');
        if (!ret.ok) {
            await act.outputProblem(ret.body);
            return;
        }
        return ret.body;
    });

    const db = createMemo(() => { return info()?.db; });
    const allowedMaxConnections = createMemo(() => {
        const c = db()?.maxOpenConnections;
        return (c && c > 0) ? c : l.t('_p.system.unlimited')!;
    });

    // backup

    const [backup, {refetch}] = createResource(async () => {
        const ret = await api.get<Backup>('/system/backup');
        if (!ret.ok) {
            await act.outputProblem(ret.body);
            return;
        }
        return ret.body;
    });

    // event source

    let axisRef: AxisRef<Numbers>;

    const [stat, setStat] = createSignal('cpu');
    const changeTab = (val: string) => {
        setStat(val);
    };

    const [data, setData] = createSignal<Array<Numbers>>([]);

    const [cpu, setCPU] = createSignal<Array<Numbers>>([]);
    const [mem, setMem] = createSignal<Array<Numbers>>([]);
    const [conns, setConns] = createSignal<Array<Numbers>>([]);
    const [goroutines, setGoroutines] = createSignal<Array<Numbers>>([]);

    createEffect(() => {
        axisRef.clear();

        switch (stat()) {
        case 'cpu':
            axisRef.append(...cpu());
            break;
        case 'memory':
            axisRef.append(...mem());
            break;
        case 'connections':
            axisRef.append(...conns());
            break;
        case 'goroutines':
            axisRef.append(...goroutines());
            break;
        }
    });

    onMount(async () => {
        const fixed = (num: number)=>Math.round(num * 100) / 100; // 固定小数点
        const es = await api.eventSource('/sse', true);

        es!.addEventListener('systat', (s: MessageEvent) => {
            const d = JSON.parse(s.data) as Stats;
            const os = d.os;
            const pro = d.process;

            const start = d.created.indexOf(':');
            const end = d.created.indexOf('.');
            const created = d.created.slice(start+1, end);

            setCPU((prev) => [...prev, { os: fixed(os.cpu), process: fixed(pro.cpu), created: created }]);
            setMem((prev) => [...prev, { os: fixed(os.mem/mb), process: fixed(pro.mem/mb), created: created }]);
            setConns((prev) => [...prev, { os: fixed(os.net.conns), process: fixed(pro.conns), created: created }]);
            setGoroutines((prev) => [...prev, { os: 0, process: fixed(pro.goroutines), created: created }]);

            switch(stat()) {
            case 'cpu':
                axisRef.append({ os: fixed(os.cpu), process: fixed(pro.cpu), created: created });
                setData(cpu());
                break;
            case 'mem':
                axisRef.append({ os: fixed(os.mem/mb), process: fixed(pro.mem/mb), created: created });
                setData(mem());
                break;
            case 'conns':
                axisRef.append({ os: fixed(os.net.conns), process: fixed(pro.conns), created: created });
                setData(conns());
                break;
            case 'goroutines':
                axisRef.append({ os: 0, process: fixed(pro.goroutines), created: created });
                setData(goroutines());
                break;
            }
        });

        const r = await api.post('/system/systat');
        if (!r.ok) {
            console.error(r.body);
        }
    });

    onCleanup(async () => {
        await api.delete('/system/systat');
    });

    return <Page title="_p.system.serverInfo" class={ joinClass('!max-w-lg', styles.info)}>
        <fieldset class={joinClass(styles.panel, 'w-[45%]', 'max-sm:w-full')}>
            <Label icon={IconInfo} tag='legend'>{l.t('_p.system.serverInfo')}</Label>
            <dl><dt>{l.t('_p.system.name')}</dt><dd>{info()?.id}&nbsp;({info()?.version})</dd></dl>

            <dl><dt>{l.t('_p.system.arch')}</dt><dd>{info()?.arch}</dd></dl>

            <dl><dt>{l.t('_p.system.cpus')}</dt><dd>{info()?.cpus}</dd></dl>

            <dl><dt>{l.t('_p.system.go')}</dt><dd>{info()?.go}</dd></dl>

            <dl><dt>goroutines</dt><dd>{info()?.goroutines}</dd></dl>

            <dl><dt>{l.t('_p.system.uptime')}</dt><dd>{l.datetimeFormat().format(info()?.uptime)}</dd></dl>

            <Divider padding='1rem'><IconDataset class="mr-1" />{l.t('_c.os')}</Divider>

            <dl><dt>{l.t('_p.system.platform')}</dt><dd>{info()?.os.platform}</dd></dl>

            <dl><dt>{l.t('_p.system.family')}</dt><dd>{info()?.os.family}</dd></dl>

            <dl><dt>{l.t('_p.system.version')}</dt><dd>{info()?.os.version}</dd></dl>

            <dl><dt>{l.t('_p.system.uptime')}</dt><dd>{l.datetimeFormat().format(info()?.os.boot)}</dd></dl>

            <Divider padding='1rem'><IconDatabase class="mr-1" />{l.t('_c.database')}</Divider>

            <dl><dt>{l.t('_c.database')}</dt><dd>{db()?.name}&nbsp;({db()?.version})</dd></dl>

            <dl>
                <dt>{l.t('_p.system.connections')}</dt>
                <dd title={
                    l.t('_p.system.connectionsHelp', {
                        maxOpenConnections: allowedMaxConnections(),
                        openConnections: db()?.openConnections!,
                        idle: db()?.idle!,
                        inUse: db()?.inUse!,
                    })
                }>
                    {allowedMaxConnections()} / {db()?.openConnections} / {db()?.idle} / {db()?.inUse}
                </dd>
            </dl>

            <dl><dt>{l.t('_p.system.waitCount')}</dt><dd>{db()?.waitCount}</dd></dl>

            <dl><dt>{l.t('_p.system.waitDuration')}</dt><dd>{db()?.waitDuration}</dd></dl>
        </fieldset>

        <fieldset class={joinClass(styles.panel, 'w-[45%]', 'max-sm:w-full')}>
            <Label icon={IconAction} tag='legend'>{l.t('_p.actions')}</Label>

            <ConfirmButton palette='secondary' onClick={async () => await act.clearCache()}>
                <IconClear class="mr-1" />{l.t('_p.system.clearCache')}
            </ConfirmButton>
            <span class="mt-1">{l.t('_p.system.clearCacheHelp')}</span>

            <Divider padding='1rem' />
            <ConfirmButton palette='secondary' disabled={backup()?.cron === ''} onClick={async () => {
                const ret = await api.post('/system/backup');
                if (!ret.ok) {
                    await act.outputProblem(ret.body);
                    return;
                }
                await refetch();
            }}>
                <IconBackup class="mr-1" />{l.t('_p.system.backupDB')}
            </ConfirmButton>
            <span class="mt-1">{l.t('_p.system.backupDBHelp', { cron: backup()?.cron! })}</span>
            <ul class={styles.backup_list}>
                <For each={backup()?.list}>
                    {(item) => (
                        <li>
                            {item.path}&nbsp;({bytesFormatter()(item.size)})
                            <ConfirmButton kind='flat' palette='error' onClick={async () => {
                                const ret = await api.delete('/system/backup/' + item.path);
                                if (!ret.ok) {
                                    await act.outputProblem(ret.body);
                                    return;
                                }
                                await refetch();
                            }}>{l.t('_p.deleteItem')}</ConfirmButton>
                        </li>
                    )}
                </For>
            </ul>
        </fieldset>

        <fieldset class={joinClass(styles.panel, 'w-full') }>
            <Label icon={IconChart} tag='legend'>{l.t('_p.system.states')}</Label>
            <Tab onChange={changeTab} class="flex-grow-0 m-auto mb-4" items={[
                ['cpu', l.t('_c.cpu') + ' (%)'],
                ['memory', l.t('_c.memory') + ' (MB)'],
                ['connections', l.t('_p.system.connections')],
                ['goroutines', l.t('_p.system.goroutines')],
            ]} />
            <AxisChart ref={(el) => axisRef = el} width='auto' size={50} tooltip legend='center' xAxis={{ key: 'created' }}
                series={[
                    { type: 'line', key: 'os', name: l.t('_c.os'), area: true, smooth: true },
                    { type: 'line', key: 'process', name: l.t('_c.process'), area: true, smooth: true },
                ]}
                data={data()}
            />
        </fieldset>
    </Page>;
}

interface Info {
    arch: string;
    cpus: number;
    go: string;
    goroutines: number;
    id: string;
    os: {
        platform: string;
        family: string;
        version: string;
        boot: string;
    };
    uptime: string;
    version: string;
    db: {
        openConnections: number;
        idle: number;
        inUse: number;

        //maxIdleClosed: number;
        //maxIdleTimeClosed: number;
        //maxLifetimeClosed: number;
        maxOpenConnections: number;
        name: string;
        version: string;
        waitCount: number;
        waitDuration: string;
    }
}

interface Numbers {
    os: number;
    process: number;
    created: string;
}

/**
 *监视的状态信息
 */
interface Stats {
    os: OS; // 系统级别的状态信息
    process: Process; // 当前进程的状态信息
    created: string; // 此条记录的创建时间
}

interface OS {
    cpu: number; // CPU 使用百分比
    mem: number; // 内存使用量，以 byte 为单位。
    net: Net;     // 网络相关数据
}

interface Process {
    cpu: number; // CPU 使用百分比
    mem: number; // 内存使用量，以 byte 为单位。
    conns: number; // 连接数量
    goroutines: number;
}

// Net 与网络相关的信息
interface Net {
    conns: number; // 连接数量
    sent: number; // 发送数量，以字节为单位。
    recv: number; // 读取数量，以字节为单位。
}

interface Backup {
    cron: string;
    list: Array<BackupFile>;
}

interface BackupFile {
    path: string;
    mod: string;
    size: number;
}
