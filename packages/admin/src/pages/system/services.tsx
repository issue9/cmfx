// SPDX-FileCopyrightText: 2024-2025 caixw
//
// SPDX-License-Identifier: MIT

import { Column, Label, LoaderTable, Page, translateEnums } from '@cmfx/components';
import { Query } from '@cmfx/core';
import { createMemo, JSX } from 'solid-js';

import { use, useLocale } from '@/context';
import { MessagesKey } from '@/messages';

interface Service {
    jobs: Array<Job>;
    services: Array<Task>;
}

type State = 'stopped' | 'running' | 'failed';

interface Task {
    err?: string;
    state: State;
    title: string;
}

interface Job extends Task {
    next: string;
    prev: string;
}

export const stateMap: Array<[State, MessagesKey]> = [
    ['stopped', '_p.system.serviceStates.stopped'],
    ['running', '_p.system.serviceStates.running'],
    ['failed', '_p.system.serviceStates.failed'],
] as const;

/**
 * 服务列表页面
 */
export function Services(): JSX.Element {
    const [api, act] = use();
    const l = useLocale();

    const items = createMemo(async()=>{
        const ret = await api.get<Service>('/system/services');
        if (!ret.ok) {
            await act.outputProblem(ret.body);
            return;
        }
        return ret.body;
    });

    const states = createMemo(() => { return translateEnums<State>(stateMap, l); });

    return <Page title='_p.system.serviceViewer' class="max-w-lg">
        <fieldset>
            <Label icon='subtitles_gear' tag='legend'>{l.t('_p.system.services')}</Label>
            <LoaderTable hoverable load={async(_:Query)=>(await items())?.services} queries={{}} columns={[
                {id: 'title', label: l.t('_p.system.title')},
                {id: 'state', label: l.t('_p.system.serviceState'), content: ((_: string, v?: State) => {
                    return states().find((val) => val[0] === v)?.[1];
                }) as Column<Task>['content']},
                {id: 'err', label: l.t('_p.system.error')},
            ]} />
        </fieldset>

        <br />

        <fieldset>
            <Label icon='task' tag='legend'>{l.t('_p.system.jobs')}</Label>
            <LoaderTable hoverable load={async(_:Query)=>(await items())?.jobs} queries={{}} columns={[
                {id: 'title', label: l.t('_p.system.title')},
                {id: 'state', label: l.t('_p.system.serviceState'),content: ((_: string, v?: State) => {
                    return states().find((val) => val[0] === v)?.[1];
                }) as Column<Job>['content']},
                {id: 'err', label: l.t('_p.system.error')},
                {id: 'next', label: l.t('_p.system.next'), content: (_: string, val?: string) => { return l.datetime(val); }},
                {id: 'prev', label: l.t('_p.system.prev'), content: (_: string, val?: string) => { return l.datetime(val); }},
            ]} />
        </fieldset>
    </Page>;
}
