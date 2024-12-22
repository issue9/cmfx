// SPDX-FileCopyrightText: 2024 caixw
//
// SPDX-License-Identifier: MIT

import { createEffect, createMemo, createResource, createSignal, For, JSX, onCleanup, onMount } from 'solid-js';

import { AxisChart, AxisRef, ConfirmButton, Divider, Icon, Label, Page, Tab, useApp } from '@/components';

const mb = 1024 * 1024;

export function Info(): JSX.Element {
    const ctx = useApp();

    const [info] = createResource(async()=>{
        const ret = await ctx.api.get<Info>('/system/info');
        if (!ret.ok) {
            await ctx.outputProblem(ret.body);
            return;
        }
        return ret.body;
    });

    const db = createMemo(() => { return info()?.db; });
    const allowedMaxConnections = createMemo(() => {
        const c = db()?.maxOpenConnections;
        return (c && c > 0) ? c : ctx.locale().t('_i.page.system.unlimited')!;
    });

    // backup

    const [backup, {refetch}] = createResource(async () => {
        const ret = await ctx.api.get<Backup>('/system/backup');
        if (!ret.ok) {
            await ctx.outputProblem(ret.body);
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
        const fixed = (num: number)=>Math.round(num * 100) / 100;

        await ctx.api.onEventSource('systat', (s: MessageEvent<Stats>) => {
            const os = s.data.os;
            const pro = s.data.process;
            
            const start = s.data.created.indexOf(':');
            const end = s.data.created.indexOf('.');
            const created = s.data.created.slice(start+1, end);

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

        await ctx.api.post('/system/systat');
    });

    onCleanup(async () => {
        await ctx.api.delete('/system/systat');
    });

    return <Page title="_i.page.system.info" class="max-w-lg">
        <div class="p--system-info">
            <fieldset class="panel w-[45%]">
                <Label icon="info" tag='legend'>{ctx.locale().t('_i.page.system.info')}</Label>
                <dl><dt>{ ctx.locale().t('_i.page.system.name') }</dt><dd>{info()?.name}&nbsp;({info()?.version})</dd></dl>

                <dl><dt>{ ctx.locale().t('_i.page.system.arch') }</dt><dd>{info()?.arch}</dd></dl>

                <dl><dt>{ ctx.locale().t('_i.page.system.cpus') }</dt><dd>{info()?.cpus}</dd></dl>

                <dl><dt>{ ctx.locale().t('_i.page.system.go') }</dt><dd>{info()?.go}</dd></dl>

                <dl><dt>goroutines</dt><dd>{info()?.goroutines}</dd></dl>

                <dl><dt>{ ctx.locale().t('_i.page.system.uptime') }</dt><dd>{ctx.locale().datetime(info()?.uptime)}</dd></dl>

                <Divider padding='.5rem'><Icon class="mr-1" icon="dataset" />{ctx.locale().t('_i.os')}</Divider>

                <dl><dt>{ ctx.locale().t('_i.page.system.platform') }</dt><dd>{info()?.os.platform}</dd></dl>

                <dl><dt>{ ctx.locale().t('_i.page.system.family') }</dt><dd>{info()?.os.family}</dd></dl>

                <dl><dt>{ ctx.locale().t('_i.page.system.version') }</dt><dd>{info()?.os.version}</dd></dl>

                <dl><dt>{ ctx.locale().t('_i.page.system.uptime') }</dt><dd>{ctx.locale().datetime(info()?.os.boot)}</dd></dl>

                <Divider padding='.5rem'><Icon class="mr-1" icon="database" />{ctx.locale().t('_i.database')}</Divider>

                <dl><dt>{ ctx.locale().t('_i.database') }</dt><dd>{db()?.name}&nbsp;({db()?.version})</dd></dl>

                <dl>
                    <dt>{ ctx.locale().t('_i.page.system.connections') }</dt>
                    <dd title={
                        ctx.locale().t('_i.page.system.connectionsHelp', {
                            maxOpenConnections: allowedMaxConnections(),
                            openConnections: db()?.openConnections!,
                            idle: db()?.idle!,
                            inUse: db()?.inUse!,
                        })
                    }>
                        {allowedMaxConnections()} / {db()?.openConnections} / { db()?.idle } / { db()?.inUse }
                    </dd>
                </dl>

                <dl><dt>{ ctx.locale().t('_i.page.system.waitCount') }</dt><dd>{db()?.waitCount}</dd></dl>

                <dl><dt>{ ctx.locale().t('_i.page.system.waitDuration') }</dt><dd>{db()?.waitDuration}</dd></dl>
            </fieldset>

            <fieldset class="panel w-[45%]">
                <Label icon='action_key' tag='legend'>{ ctx.locale().t('_i.page.actions') }</Label>

                <ConfirmButton palette='secondary' onClick={async()=>await ctx.clearCache()}>
                    <Icon class="mr-1" icon="clear_all" />{ ctx.locale().t('_i.page.system.clearCache') }
                </ConfirmButton>
                <span class="mt-1">{ctx.locale().t('_i.page.system.clearCacheHelp')}</span>

                <Divider padding='1rem' />
                <ConfirmButton palette='secondary' disabled={backup()?.cron===''} onClick={async()=>{
                    const ret = await ctx.api.post('/system/backup');
                    if (!ret.ok) {
                        await ctx.outputProblem(ret.body);
                        return;
                    }
                    await refetch();
                }}>
                    <Icon class="mr-1" icon="backup" />{ ctx.locale().t('_i.page.system.backupDB') }
                </ConfirmButton>
                <span class="mt-1">{ctx.locale().t('_i.page.system.backupDBHelp', {cron: backup()?.cron!})}</span>
                <ul class="backup_list">
                    <For each={backup()?.list}>
                        {(item)=>(
                            <li>
                                {item.path}&nbsp;({ctx.locale().bytes(item.size)})
                                <ConfirmButton kind='flat' palette='error' onClick={async()=>{
                                    const ret = await ctx.api.delete('/system/backup/'+item.path);
                                    if (!ret.ok) {
                                        await ctx.outputProblem(ret.body);
                                        return;
                                    }
                                    await refetch();
                                }}>{ ctx.locale().t('_i.page.deleteItem') }</ConfirmButton>
                            </li>
                        )}
                    </For>
                </ul>
            </fieldset>

            <fieldset class="panel states">
                <Label icon='ssid_chart' tag='legend'>{ ctx.locale().t('_i.page.system.states') }</Label>
                <Tab onChange={changeTab} class="flex-grow-0 m-auto mb-4" items={[
                    ['cpu', ctx.locale().t('_i.cpu')],
                    ['memory', ctx.locale().t('_i.memory')],
                    ['connections', ctx.locale().t('_i.page.system.connections')],
                    ['goroutines', ctx.locale().t('_i.page.system.goroutines')],
                ]} />
                <AxisChart ref={(el)=>axisRef=el} width='auto' size={50} tooltip legend='center' xAxis={{key: 'created'}}
                    series={[
                        { type: 'line', key: 'os', name: ctx.locale().t('_i.os'), area: true, smooth: true },
                        { type: 'line', key: 'process', name: ctx.locale().t('_i.process'), area: true, smooth: true },
                    ]}
                    data={data()}
                />
            </fieldset>
        </div>
    </Page>;
}

interface Info {
    arch: string;
    cpus: number;
    go: string;
    goroutines: number;
    name: string;
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
