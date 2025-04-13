// SPDX-FileCopyrightText: 2024-2025 caixw
//
// SPDX-License-Identifier: MIT

import { Query } from '@cmfx/core';
import { Component, JSX, Show } from 'solid-js';

import { Button, LinkButton, Page, RemoteTable, RemoteTableRef, TextField, translateEnum, useApp } from '@admin/components';
import { Sex, sexesMap, SexSelector, State, StateSelector, statesMap } from '@admin/pages/common';
import { Member } from './types';

export interface ActionProps {
    /**
     * 当前数据行的 ID
     */
    id: number;
    
    /**
     * 当前数据行
     */
    member?: Member;
    
    /**
     * 对整个表格的引用
     */
    table?: RemoteTableRef<Member>;
}

interface Props {
    /**
     * 路由基地址
     */
    routePrefix: string;
    
    /**
     * 操作列中的组件
     */
    actions?: Component<ActionProps>;
}

interface Q extends Query {
    text: string;
    state: Array<State>;
    sex: Array<Sex>;
}

/**
 * 会员列表组件
 */
export function Members(props: Props): JSX.Element {
    const ctx = useApp();

    const q: Q = {
        text: '',
        page: 1,
        state: ['normal','locked'],
        sex: ['male', 'female', 'unknown']
    };

    let ref: RemoteTableRef<Member>;

    return <Page title="_i.page.member.membersManager">
        <RemoteTable<Member, Q> ref={(el)=>ref=el} inSearch paging path='/members' queries={q} systemToolbar queryForm={(qa) => (
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
            { id: 'nickname', label: ctx.locale().t('_i.page.nickname') },
            { id: 'created', label: ctx.locale().t('_i.page.created'), content: (_, v)=> ctx.locale().datetime(v as string) },
            {
                id: 'state', label: ctx.locale().t('_i.page.state'), content: (_, v) => {
                    return translateEnum(statesMap, ctx, v as State);
                }
            },
            {
                id: 'actions', cellClass:'no-print', label: ctx.locale().t('_i.page.actions'), isUnexported: true, renderContent: ((_, __, obj?: Member) => {
                    return <div class="flex gap-x-2">
                        <Show when={obj?.state !== 'deleted'}>
                            <LinkButton icon rounded palette='tertiary'
                                href={`${props.routePrefix}/${obj!['id']}`}
                                title={ctx.locale().t('_i.page.member.view')}>visibility</LinkButton>
                        </Show>

                        <Show when={obj?.state !== 'locked' && obj?.state !== 'deleted'}>
                            <Button icon rounded palette='error' title={ctx.locale().t('_i.page.admin.lockUser')} onClick={async () => {
                                const r = await ctx.api.post(`/members/${obj!['id']}/locked`);
                                if (!r.ok) {
                                    await ctx.outputProblem(r.body);
                                    return;
                                }
                                await ref.refresh();
                            }}>lock</Button>
                        </Show>

                        <Show when={obj?.state === 'locked'}>
                            <Button icon rounded palette='tertiary' title={ctx.locale().t('_i.page.admin.unlockUser')} onClick={async () => {
                                const r = await ctx.api.delete(`/members/${obj!['id']}/locked`);
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
                        
                        <Show when={props.actions}>
                            {props.actions!({ id: obj?.id as number, member: obj, table: ref })}
                        </Show>
                    </div>;
                })
            },
        ]} />
    </Page>;
}
