// SPDX-FileCopyrightText: 2024 caixw
//
// SPDX-License-Identifier: MIT

import { createMemo, createResource, For, JSX } from 'solid-js';

import { useApp } from '@/app';
import { ConfirmButton, Divider, Page } from '@/components';

export default function(): JSX.Element {
    const ctx = useApp();

    const [info] = createResource(async()=>{
        const ret = await ctx.api.get<Info>('/system/info');
        if (!ret.ok) {
            await ctx.outputProblem(ret.status, ret.body);
            return;
        }
        return ret.body;
    });

    const db = createMemo(() => { return info()?.db; });
    const allowedMaxConnections = createMemo(() => {
        const c = db()?.maxOpenConnections;
        return (c && c > 0) ? c : ctx.t('_i.page.system.unlimited')!;
    });

    // backup

    const [backup, {refetch}] = createResource(async () => {
        const ret = await ctx.api.get<Backup>('/system/backup');
        if (!ret.ok) {
            await ctx.outputProblem(ret.status, ret.body);
            return;
        }
        return ret.body;
    });

    return <Page title="_i.page.system.info" class="max-w-lg">
        <div class="p--system-info">
            <fieldset class="w-[45%]">
                <legend><Legend icon='info' text={ctx.t('_i.page.system.info')} /></legend>
                <dl><dt>{ ctx.t('_i.page.system.name') }</dt><dd>{info()?.name}&nbsp;({info()?.version})</dd></dl>

                <dl><dt>{ ctx.t('_i.page.system.arch') }</dt><dd>{info()?.arch}</dd></dl>

                <dl><dt>{ ctx.t('_i.page.system.cpus') }</dt><dd>{info()?.cpus}</dd></dl>

                <dl><dt>{ ctx.t('_i.page.system.go') }</dt><dd>{info()?.go}</dd></dl>

                <dl><dt>goroutines</dt><dd>{info()?.goroutines}</dd></dl>

                <dl><dt>{ ctx.t('_i.page.system.uptime') }</dt><dd>{ctx.locale().date(info()?.uptime)}</dd></dl>

                <Divider padding='.5rem'><span class="c--icon mr-1">dataset</span>{ctx.t('_i.os')}</Divider>

                <dl><dt>{ ctx.t('_i.page.system.platform') }</dt><dd>{info()?.os.platform}</dd></dl>

                <dl><dt>{ ctx.t('_i.page.system.family') }</dt><dd>{info()?.os.family}</dd></dl>

                <dl><dt>{ ctx.t('_i.page.system.version') }</dt><dd>{info()?.os.version}</dd></dl>

                <dl><dt>{ ctx.t('_i.page.system.uptime') }</dt><dd>{ctx.locale().date(info()?.os.boot)}</dd></dl>

                <Divider padding='.5rem'><span class="c--icon mr-1">database</span>{ctx.t('_i.database')}</Divider>

                <dl><dt>{ ctx.t('_i.database') }</dt><dd>{db()?.name}&nbsp;({db()?.version})</dd></dl>

                <dl>
                    <dt>{ ctx.t('_i.page.system.connections') }</dt>
                    <dd title={
                        ctx.t('_i.page.system.connectionsHelp', {
                            maxOpenConnections: allowedMaxConnections(),
                            openConnections: db()?.openConnections!,
                            idle: db()?.idle!,
                            inUse: db()?.inUse!,
                        })
                    }>
                        {allowedMaxConnections()} / {db()?.openConnections} / { db()?.idle } / { db()?.inUse }
                    </dd>
                </dl>

                <dl><dt>{ ctx.t('_i.page.system.waitCount') }</dt><dd>{db()?.waitCount}</dd></dl>

                <dl><dt>{ ctx.t('_i.page.system.waitDuration') }</dt><dd>{db()?.waitDuration}</dd></dl>
            </fieldset>

            <fieldset class="w-[45%]">
                <legend><Legend icon='action_key' text={ ctx.t('_i.page.actions') } /></legend>

                <ConfirmButton palette='secondary' onClick={async()=>await ctx.clearCache()}>
                    <span class="c--icon mr-1">clear_all</span>{ ctx.t('_i.page.system.clearCache') }
                </ConfirmButton>
                <span class="mt-1">{ctx.t('_i.page.system.clearCacheHelp')}</span>

                <Divider padding='1rem' />
                <ConfirmButton palette='secondary' disabled={backup()?.cron===''} onClick={async()=>{
                    const ret = await ctx.api.post('/system/backup');
                    if (!ret.ok) {
                        ctx.outputProblem(ret.status, ret.body);
                        return;
                    }
                    await refetch();
                }}>
                    <span class="c--icon mr-1">backup</span>{ ctx.t('_i.page.system.backupDB') }
                </ConfirmButton>
                <span class="mt-1">{ctx.t('_i.page.system.backupDBHelp', {cron: backup()?.cron!})}</span>
                <ul class="backup_list">
                    <For each={backup()?.list}>
                        {(item)=>(
                            <li>
                                {item.path}&nbsp;({ctx.locale().bytes(item.size,2)})
                                <ConfirmButton style='flat' palette='error' onClick={async()=>{
                                    const ret = await ctx.api.delete('/system/backup/'+item.path);
                                    if (!ret.ok) {
                                        ctx.outputProblem(ret.status, ret.body);
                                        return;
                                    }
                                    await refetch();
                                }}>{ ctx.t('_i.page.deleteItem') }</ConfirmButton>
                            </li>
                        )}
                    </For>
                </ul>
            </fieldset>

            <fieldset class="states">
                <legend><Legend icon='ssid_chart' text={ ctx.t('_i.page.system.states') } /></legend>
                <div>chart</div>
            </fieldset>
        </div>
    </Page>;
}

function Legend(p: {icon?: string, text?: string}) {
    return <span class="c--icon-container mx-1"><span class="c--icon mr-1">{p.icon}</span>{p.text}</span>;
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
