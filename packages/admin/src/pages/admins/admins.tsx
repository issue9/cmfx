// SPDX-FileCopyrightText: 2024-2025 caixw
//
// SPDX-License-Identifier: MIT

import { Button, LinkButton, Page, RemoteTable, RemoteTableRef, TextField, translateEnums, useLocale } from '@cmfx/components';
import { Query } from '@cmfx/core';
import { createMemo, JSX, Show } from 'solid-js';

import { user } from '@/components';
import { use } from '@/context';

interface Props {
    /**
     * 路由基地址
     */
    routePrefix: string;
}

interface Q extends Query {
    text: string;
    state: Array<user.State>;
    sex: Array<user.Sex>;
}

export function Admins(props: Props): JSX.Element {
    const l = useLocale();
    const [api, act] = use();

    const q: Q = {
        text: '',
        page: 1,
        state: ['normal','locked'],
        sex: ['male', 'female', 'unknown']
    };

    let ref: RemoteTableRef<Admin>;

    const sexes = createMemo(() => { return translateEnums<user.Sex>(user.sexes, l); });
    const states = createMemo(() => { return translateEnums<user.State>(user.states, l); });

    return <Page title="_i.admin.adminsManager">
        <RemoteTable<Admin, Q> ref={(el)=>ref=el} inSearch paging path='/admins' queries={q} systemToolbar toolbar={
            <LinkButton palette='primary' href={`${props.routePrefix}/0`}>{l.t('_i.newItem')}</LinkButton>
        } queryForm={(qa) => (
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
            { id: 'name', label: l.t('_i.admin.name') },
            { id: 'nickname', label: l.t('_i.nickname') },
            { id: 'created', label: l.t('_i.created'), content: (_, v)=> l.datetime(v as string) },
            {
                id: 'state', label: l.t('_i.state'), content: (_, v) => {
                    return states().find((val) => val[0] === v)?.[1];
                }
            },
            {
                id: 'actions', cellClass: 'no-print', label: l.t('_i.actions'), isUnexported: true, renderContent: ((_, __, obj?: Admin) => {
                    return <div class="flex gap-x-2">
                        <Show when={obj?.state !== 'deleted'}>
                            <LinkButton icon rounded palette='tertiary'
                                href={`${props.routePrefix}/${obj!['id']}`}
                                title={l.t('_i.editItem')}>edit</LinkButton>
                        </Show>

                        <Show when={obj?.state !== 'locked' && obj?.state!=='deleted'}>
                            <Button icon rounded palette='error' title={l.t('_i.admin.lockUser')} onClick={async()=>{
                                const r = await api.post(`/admins/${obj!['id']}/locked`);
                                if (!r.ok) {
                                    await act.outputProblem(r.body);
                                    return;
                                }
                                await ref.refresh();
                            }}>lock</Button>
                        </Show>

                        <Show when={obj?.state === 'locked'}>
                            <Button icon rounded palette='tertiary' title={l.t('_i.admin.unlockUser')} onClick={async()=>{
                                const r = await api.delete(`/admins/${obj!['id']}/locked`);
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
                    </div>;
                })
            },
        ]} />
    </Page>;
}

export interface Admin {
    id?: number;
    no?: string;
    sex: user.Sex;
    name: string;
    nickname: string;
    avatar?: string;
    created?: string;
    state: user.State;
}
