// SPDX-FileCopyrightText: 2024-2025 caixw
//
// SPDX-License-Identifier: MIT

import {
    Button, LinkButton, Page, RemoteTable, RemoteTableRef, TextField, translateEnums, useLocale
} from '@cmfx/components';
import { Query } from '@cmfx/core';
import { createMemo, JSX, Show } from 'solid-js';
import IconEdit from '~icons/material-symbols/edit';
import IconLock from '~icons/material-symbols/lock';
import IconLockOpenRight from '~icons/material-symbols/lock-open-right';

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

    return <Page title="_p.admin.adminsManager">
        <RemoteTable<Admin, Q> ref={(el)=>ref=el} inSearch paging path='/admins' queries={q} systemToolbar toolbar={
            <LinkButton palette='primary' href={`${props.routePrefix}/0`}>{l.t('_p.newItem')}</LinkButton>
        } queryForm={(qa) => (
            <>
                <TextField accessor={qa.accessor<string>('text')} />
                <user.StateSelector multiple accessor={qa.accessor<Array<user.State>>('state')} />
                <user.SexSelector multiple accessor={qa.accessor<Array<user.Sex>>('sex')} />
            </>
        )} columns={[
            { id: 'id', label: l.t('_p.id') },
            { id: 'no', label: l.t('_p.no') },
            {
                id: 'sex', label: l.t('_p.sex'), content: ((_: string, v) => {
                    return sexes().find((val) => val[0] === v)?.[1];
                })
            },
            { id: 'name', label: l.t('_p.admin.name') },
            { id: 'nickname', label: l.t('_p.nickname') },
            { id: 'created', label: l.t('_p.created'), content: (_, v)=> l.datetimeFormat().format(new Date(v as string)) },
            {
                id: 'state', label: l.t('_p.state'), content: (_, v) => {
                    return states().find((val) => val[0] === v)?.[1];
                }
            },
            {
                id: 'actions', cellClass: 'no-print', label: l.t('_p.actions'), isUnexported: true, renderContent: ((_, __, obj?: Admin) => {
                    return <div class="flex gap-x-2">
                        <Show when={obj?.state !== 'deleted'}>
                            <LinkButton square rounded palette='tertiary'
                                href={`${props.routePrefix}/${obj!['id']}`}
                                title={l.t('_p.editItem')}><IconEdit /></LinkButton>
                        </Show>

                        <Show when={obj?.state !== 'locked' && obj?.state!=='deleted'}>
                            <Button square rounded palette='error' title={l.t('_p.admin.lockUser')} onClick={async()=>{
                                const r = await api.post(`/admins/${obj!['id']}/locked`);
                                if (!r.ok) {
                                    await act.outputProblem(r.body);
                                    return;
                                }
                                await ref.refresh();
                            }}><IconLock /></Button>
                        </Show>

                        <Show when={obj?.state === 'locked'}>
                            <Button square rounded palette='tertiary' title={l.t('_p.admin.unlockUser')} onClick={async()=>{
                                const r = await api.delete(`/admins/${obj!['id']}/locked`);
                                if (!r.ok) {
                                    await act.outputProblem(r.body);
                                    return;
                                }
                                await ref.refresh();
                            }}><IconLockOpenRight /></Button>
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
