// SPDX-FileCopyrightText: 2024 caixw
//
// SPDX-License-Identifier: MIT

import { createResource, JSX } from 'solid-js';

import { useApp } from '@/app';
import { Page } from '@/components';

interface Info {
    arch: string;
    cpus: number;
    go: string;
    goroutines: number;
    name: string;
    os: string;
    uptime: string;
    version: string;
    db: {
        idle: number;
        inUse: number;
        maxIdleClosed: number;
        maxIdleTimeClosed: number;
        maxLifetimeClosed: number;
        maxOpenConnections: number;
        name: string;
        openConnections: number;
        version: string;
        waitCount: number;
        waitDuration: string;
    }
}

export default function(): JSX.Element {
    const ctx = useApp();

    const [info] = createResource(async()=>{
        const ret = await ctx.get<Info>('/system/info');
        if (!ret.ok) {
            await ctx.outputProblem(ret.status, ret.body);
            return;
        }

        return ret.body;
    });

    return <Page title="_i.page.system.info">
        <div class="p--system-info">
            <fieldset>
                <legend>TODO</legend>
                <dl>
                    <dt>name</dt>
                    <dd>{info()?.name}</dd>
                </dl>

                <dl>
                    <dt>version</dt>
                    <dd>{info()?.version}</dd>
                </dl>

                <dl>
                    <dt>arch</dt>
                    <dd>{info()?.arch}</dd>
                </dl>

                <dl>
                    <dt>cpus</dt>
                    <dd>{info()?.cpus}</dd>
                </dl>

                <dl>
                    <dt>go</dt>
                    <dd>{info()?.go}</dd>
                </dl>

                <dl>
                    <dt>goroutines</dt>
                    <dd>{info()?.goroutines}</dd>
                </dl>

                <dl>
                    <dt>os</dt>
                    <dd>{info()?.os}</dd>
                </dl>

                <dl>
                    <dt>uptime</dt>
                    <dd>{info()?.uptime}</dd>
                </dl>
            </fieldset>

            <fieldset>
                <legend>TODO DB</legend>
                <dl>
                    <dt>name</dt>
                    <dd>{info()?.db.name}</dd>
                </dl>

                <dl>
                    <dt>version</dt>
                    <dd>{info()?.db.version}</dd>
                </dl>

                <dl>
                    <dt>idle</dt>
                    <dd>{info()?.db.idle}</dd>
                </dl>

                <dl>
                    <dt>inUse</dt>
                    <dd>{info()?.db.inUse}</dd>
                </dl>

                <dl>
                    <dt>maxIdleClosed</dt>
                    <dd>{info()?.db.maxIdleClosed}</dd>
                </dl>

                <dl>
                    <dt>maxIdleTimeClosed</dt>
                    <dd>{info()?.db.maxIdleTimeClosed}</dd>
                </dl>

                <dl>
                    <dt>maxLifetimeClosed</dt>
                    <dd>{info()?.db.maxLifetimeClosed}</dd>
                </dl>

                <dl>
                    <dt>maxOpenConnections</dt>
                    <dd>{info()?.db.maxOpenConnections}</dd>
                </dl>

                <dl>
                    <dt>openConnections</dt>
                    <dd>{info()?.db.openConnections}</dd>
                </dl>

                <dl>
                    <dt>waitCount</dt>
                    <dd>{info()?.db.waitCount}</dd>
                </dl>

                <dl>
                    <dt>waitDuration</dt>
                    <dd>{info()?.db.waitDuration}</dd>
                </dl>
            </fieldset>

            <div class="state">

            </div>
        </div>
    </Page>;
}