// SPDX-FileCopyrightText: 2024-2025 caixw
//
// SPDX-License-Identifier: MIT

import { Button, Page, RemoteTable, RemoteTableRef, TextField } from '@cmfx/components';
import { Query } from '@cmfx/core';
import { Component, createMemo, JSX, Show } from 'solid-js';
import IconLock from '~icons/material-symbols/lock';
import IconLockOpen from '~icons/material-symbols/lock-open-right';
import IconVisibility from '~icons/material-symbols/visibility';

import { user } from '@/components';
import { useAdmin, useLocale, State, Sex } from '@/context';
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
    const [api, act] = useAdmin();
    const l = useLocale();

    const q: Q = {
        text: '',
        page: 1,
        state: ['normal','locked'],
        sex: ['male', 'female', 'unknown']
    };

    let ref: RemoteTableRef<Member>;

    const sexes = createMemo(() => { return user.sexes.map(sex => ({ type: 'item', value: sex[0], label: l.t(sex[1]) })); });
    const states = createMemo(() => { return user.states.map(state => ({ type: 'item', value: state[0], label: l.t(state[1]) })); });

    return <Page title="_p.member.membersManager">
        <RemoteTable<Member, Q> rest={api} ref={(el)=>ref=el} inSearch paging path='/members' queries={q} systemToolbar queryForm={qa => (
            <>
                <TextField accessor={qa.accessor<string>('text')} />
                <user.StateSelector multiple accessor={qa.accessor<Array<State>>('state')} />
                <user.SexSelector multiple accessor={qa.accessor<Array<Sex>>('sex')} />
            </>
        )} columns={[
            { id: 'id', label: l.t('_p.id') },
            { id: 'no', label: l.t('_p.no') },
            {
                id: 'sex', label: l.t('_p.sex'), content: ((_: string, v) => {
                    return sexes().find(val => val.value === v)?.label;
                })
            },
            { id: 'nickname', label: l.t('_p.nickname') },
            {
                id: 'created', label: l.t('_p.created'),
                content: (_, v)=> l.datetimeFormat().format(new Date(v as string))
            },
            {
                id: 'state', label: l.t('_p.state'), content: (_, v) => {
                    return states().find(val => val.value === v)?.label;
                }
            },
            {
                id: 'actions', cellClass:'no-print', label: l.t('_p.actions'), isUnexported: true, renderContent: ((_, __, obj?: Member) => {
                    return <div class="flex gap-x-2">
                        <Show when={obj?.state !== 'deleted'}>
                            <Button type='a' square rounded palette='tertiary'
                                href={`${props.routePrefix}/${obj!['id']}`}
                                title={l.t('_p.member.view')}><IconVisibility /></Button>
                        </Show>

                        <Show when={obj?.state !== 'locked' && obj?.state !== 'deleted'}>
                            <Button square rounded palette='error' title={l.t('_p.admin.lockUser')} onclick={async () => {
                                const r = await api.post(`/members/${obj!['id']}/locked`);
                                if (!r.ok) {
                                    await act.handleProblem(r.body);
                                    return;
                                }
                                await ref.refresh();
                            }}><IconLock /></Button>
                        </Show>

                        <Show when={obj?.state === 'locked'}>
                            <Button square rounded palette='tertiary' title={l.t('_p.admin.unlockUser')} onclick={async () => {
                                const r = await api.delete(`/members/${obj!['id']}/locked`);
                                if (!r.ok) {
                                    await act.handleProblem(r.body);
                                    return;
                                }
                                await ref.refresh();
                            }}><IconLockOpen /></Button>
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
