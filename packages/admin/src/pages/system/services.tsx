// SPDX-FileCopyrightText: 2024-2025 caixw
//
// SPDX-License-Identifier: MIT

import { Column, Label, LoaderTable, Page, useLocale } from '@cmfx/components';
import { Query } from '@cmfx/core';
import { createMemo, JSX } from 'solid-js';
import IconSubtitle from '~icons/material-symbols/subtitles-gear';
import IconTask from '~icons/material-symbols/task';

import { handleProblem, useREST } from '@/app';
import { MessagesKey } from '@/messages';
import styles from './style.module.css';

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
    const api = useREST();
    const l = useLocale();
    const f = createMemo(() => {
        return l.datetimeFormat().format;
    });

    const items = createMemo(async()=>{
        const ret = await api.get<Service>('/system/services');
        if (!ret.ok) {
            await handleProblem(ret.body);
            return;
        }
        return ret.body;
    });

    const states = createMemo(() => { return stateMap.map(v => ({ type: 'item', value: v[0], label: l.t(v[1]) })); });

    return <Page title='_p.system.serviceViewer' class={styles.services}>
        <fieldset>
            <Label icon={<IconSubtitle />} tag='legend'>{l.t('_p.system.services')}</Label>
            <LoaderTable hoverable load={async(_:Query)=>(await items())?.services} queries={{}} columns={[
                {id: 'title', label: l.t('_p.system.title')},
                {id: 'state', label: l.t('_p.system.serviceState'), content: ((_: string, v?: State) => {
                    return states().find(val => val.value === v)?.label;
                }) as Column<Task>['content']},
                {id: 'err', label: l.t('_p.system.error')},
            ]} />
        </fieldset>

        <br />

        <fieldset>
            <Label icon={<IconTask />} tag='legend'>{l.t('_p.system.jobs')}</Label>
            <LoaderTable hoverable load={async(_:Query)=>(await items())?.jobs} queries={{}} columns={[
                {id: 'title', label: l.t('_p.system.title')},
                {id: 'state', label: l.t('_p.system.serviceState'),content: ((_: string, v?: State) => {
                    return states().find(val => val.value === v)?.label;
                }) as Column<Job>['content']},
                {id: 'err', label: l.t('_p.system.error')},
                {
                    id: 'next', label: l.t('_p.system.next'),
                    content: (_: string, val?: string) => { return val ? f()(new Date(val)) : ''; }
                },
                {
                    id: 'prev', label: l.t('_p.system.prev'),
                    content: (_: string, val?: string) => { return val ? f()(new Date(val)) : ''; }
                },
            ]} />
        </fieldset>
    </Page>;
}
