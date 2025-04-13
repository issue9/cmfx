// SPDX-FileCopyrightText: 2024-2025 caixw
//
// SPDX-License-Identifier: MIT

import { Query } from '@cmfx/core';
import { JSX, Show } from 'solid-js';

import { Button, LinkButton, Page, RemoteTable, RemoteTableRef, TextField, translateEnum, useApp } from '@/components';
import { Sex, sexesMap, SexSelector, State, StateSelector, statesMap } from '@/pages/common';

interface Props {
    /**
     * 路由基地址
     */
    routePrefix: string;
}

interface Q extends Query {
    text: string;
    state: Array<State>;
    sex: Array<Sex>;
}

export function Admins(props: Props): JSX.Element {
    const ctx = useApp();

    const q: Q = {
        text: '',
        page: 1,
        state: ['normal','locked'],
        sex: ['male', 'female', 'unknown']
    };

    let ref: RemoteTableRef<Admin>;

    return <Page title="_i.page.admin.adminsManager">
        <RemoteTable<Admin, Q> ref={(el)=>ref=el} inSearch paging path='/admins' queries={q} systemToolbar toolbar={
            <LinkButton palette='primary' href={`${props.routePrefix}/0`}>{ctx.locale().t('_i.page.newItem')}</LinkButton>
        } queryForm={(qa) => (
            <>
                <TextField accessor={qa.accessor<string>('text')} />
                <StateSelector multiple accessor={qa.accessor<Array<State>>('state')} />
                <SexSelector multiple accessor={qa.accessor<Array<Sex>>('sex')} />
            </>
        )} columns={[
            { id: 'id', label: ctx.locale().t('_i.page.id') },
            { id: 'no', label: ctx.locale().t('_i.page.no') },
            {
                id: 'sex', label: ctx.locale().t('_i.page.sex'), content: ((_: string, v) => {
                    return translateEnum(sexesMap, ctx, v as Sex);
                })
            },
            { id: 'name', label: ctx.locale().t('_i.page.admin.name') },
            { id: 'nickname', label: ctx.locale().t('_i.page.nickname') },
            { id: 'created', label: ctx.locale().t('_i.page.created'), content: (_, v)=> ctx.locale().datetime(v as string) },
            {
                id: 'state', label: ctx.locale().t('_i.page.state'), content: (_, v) => {
                    return translateEnum(statesMap, ctx, v as State);
                }
            },
            {
                id: 'actions', cellClass: 'no-print', label: ctx.locale().t('_i.page.actions'), isUnexported: true, renderContent: ((_, __, obj?: Admin) => {
                    return <div class="flex gap-x-2">
                        <Show when={obj?.state !== 'deleted'}>
                            <LinkButton icon rounded palette='tertiary'
                                href={`${props.routePrefix}/${obj!['id']}`}
                                title={ctx.locale().t('_i.page.editItem')}>edit</LinkButton>
                        </Show>

                        <Show when={obj?.state !== 'locked' && obj?.state!=='deleted'}>
                            <Button icon rounded palette='error' title={ctx.locale().t('_i.page.admin.lockUser')} onClick={async()=>{
                                const r = await ctx.api.post(`/admins/${obj!['id']}/locked`);
                                if (!r.ok) {
                                    await ctx.outputProblem(r.body);
                                    return;
                                }
                                await ref.refresh();
                            }}>lock</Button>
                        </Show>

                        <Show when={obj?.state === 'locked'}>
                            <Button icon rounded palette='tertiary' title={ctx.locale().t('_i.page.admin.unlockUser')} onClick={async()=>{
                                const r = await ctx.api.delete(`/admins/${obj!['id']}/locked`);
                                if (!r.ok) {
                                    await ctx.outputProblem(r.body);
                                    return;
                                }
                                await ref.refresh();
                            }}>lock_open_right</Button>
                        </Show>

                        <Show when={obj?.state !== 'deleted'}>
                            {ref.DeleteAction(obj!.id!)}
                        </Show>
                    </div>;
                })
            },
        ]} />
    </Page>;
}

export interface Admin {
    id?: number;
    no?: string;
    sex: Sex;
    name: string;
    nickname: string;
    avatar?: string;
    created?: string;
    state: State;
}
