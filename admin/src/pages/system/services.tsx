// SPDX-FileCopyrightText: 2024 caixw
//
// SPDX-License-Identifier: MIT

import { JSX, createMemo } from 'solid-js';

import { useApp } from '@/app';
import { Column, LoaderTable, Page, translateEnum } from '@/components';
import { Query } from '@/core';
import { MessageKey } from '@/messages';

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

export const stateMap: Array<[State, MessageKey]> = [
    ['stopped', '_i.page.system.serviceStates.stopped'],
    ['running', '_i.page.system.serviceStates.running'],
    ['failed', '_i.page.system.serviceStates.failed'],
] as const;



export default function(): JSX.Element {
    const ctx = useApp();

    const items = createMemo(async()=>{
        const ret = await ctx.api.get<Service>('/system/services');
        if (!ret.ok) {
            await ctx.outputProblem(ret.status, ret.body);
            return;
        }
        return ret.body;
    });

    return <Page title='_i.page.system.serviceViewer' class="max-w-lg">
        <fieldset>
            <legend>{ctx.locale().t('_i.page.system.services')}</legend>
            <LoaderTable load={async(_:Query)=>(await items())?.services} queries={{}} columns={[
                {id: 'title', label: ctx.locale().t('_i.page.system.title')},
                {id: 'state', label: ctx.locale().t('_i.page.system.serviceState'), content: ((_: string, v?: State) => {
                    return translateEnum(stateMap, ctx, v);
                }) as Column<Task>['content']},
                {id: 'err', label: ctx.locale().t('_i.page.system.error')},
            ]} />
        </fieldset>

        <br />

        <fieldset>
            <legend>{ctx.locale().t('_i.page.system.jobs')}</legend>
            <LoaderTable load={async(_:Query)=>(await items())?.jobs} queries={{}} columns={[
                {id: 'title', label: ctx.locale().t('_i.page.system.title')},
                {id: 'state', label: ctx.locale().t('_i.page.system.serviceState'),content: ((_: string, v?: State) => {
                    return translateEnum(stateMap, ctx, v);
                }) as Column<Job>['content']},
                {id: 'err', label: ctx.locale().t('_i.page.system.error')},
                {id: 'next', label: ctx.locale().t('_i.page.system.next')},
                {id: 'prev', label: ctx.locale().t('_i.page.system.prev')},
            ]} />
        </fieldset>
    </Page>;
}
