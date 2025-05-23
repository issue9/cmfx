// SPDX-FileCopyrightText: 2024-2025 caixw
//
// SPDX-License-Identifier: MIT

import { Button, LinkButton, Page, RemoteTable, RemoteTableRef, TextField, translateEnums } from '@cmfx/components';
import { Query } from '@cmfx/core';
import { Component, createMemo, JSX, Show } from 'solid-js';

import { user } from '@/components';
import { use, useLocale } from '@/context';
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
    state: Array<user.State>;
    sex: Array<user.Sex>;
}

/**
 * 会员列表组件
 */
export function Members(props: Props): JSX.Element {
    const [api, act] = use();
    const l = useLocale();

    const q: Q = {
        text: '',
        page: 1,
        state: ['normal','locked'],
        sex: ['male', 'female', 'unknown']
    };

    let ref: RemoteTableRef<Member>;

    const sexes = createMemo(() => { return translateEnums<user.Sex>(user.sexes, l); });
    const states = createMemo(() => { return translateEnums<user.State>(user.states, l); });

    return <Page title="_i.member.membersManager">
        <RemoteTable<Member, Q> ref={(el)=>ref=el} inSearch paging path='/members' queries={q} systemToolbar queryForm={(qa) => (
            <>
                <TextField accessor={qa.accessor<string>('text')} />
                <user.StateSelector multiple accessor={qa.accessor<Array<user.State>>('state')} />
                <user.SexSelector multiple accessor={qa.accessor<Array<user.Sex>>('sex')} />
            </>
        )} columns={[
            { id: 'id', label: l.t('_i.id') },
            { id: 'no', label: l.t('_i.no') },
            {
                id: 'sex', label: l.t('_i.sex'), content: ((_: string, v) => {
                    return sexes().find((val) => val[0] === v)?.[1];
                })
            },
            { id: 'nickname', label: l.t('_i.nickname') },
            { id: 'created', label: l.t('_i.created'), content: (_, v)=> l.datetime(v as string) },
            {
                id: 'state', label: l.t('_i.state'), content: (_, v) => {
                    return states().find((val) => val[0] === v)?.[1];
                }
            },
            {
                id: 'actions', cellClass:'no-print', label: l.t('_i.actions'), isUnexported: true, renderContent: ((_, __, obj?: Member) => {
                    return <div class="flex gap-x-2">
                        <Show when={obj?.state !== 'deleted'}>
                            <LinkButton icon rounded palette='tertiary'
                                href={`${props.routePrefix}/${obj!['id']}`}
                                title={l.t('_i.member.view')}>visibility</LinkButton>
                        </Show>

                        <Show when={obj?.state !== 'locked' && obj?.state !== 'deleted'}>
                            <Button icon rounded palette='error' title={l.t('_i.admin.lockUser')} onClick={async () => {
                                const r = await api.post(`/members/${obj!['id']}/locked`);
                                if (!r.ok) {
                                    await act.outputProblem(r.body);
                                    return;
                                }
                                await ref.refresh();
                            }}>lock</Button>
                        </Show>

                        <Show when={obj?.state === 'locked'}>
                            <Button icon rounded palette='tertiary' title={l.t('_i.admin.unlockUser')} onClick={async () => {
                                const r = await api.delete(`/members/${obj!['id']}/locked`);
                                if (!r.ok) {
                                    await act.outputProblem(r.body);
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
