// SPDX-FileCopyrightText: 2024 caixw
//
// SPDX-License-Identifier: MIT

import { JSX, Show } from 'solid-js';

import { useApp } from '@/app';
import {
    buildEnumsOptions, Button, Choice,
    ConfirmButton, LinkButton,
    Page, RemoteTable, RemoteTableRef, TextField, translateEnum
} from '@/components';
import type { Admin, Query, Sex, State } from './types';
import { sexesMap, statesMap } from './types';

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

export default function(props: Props): JSX.Element {
    const ctx = useApp();

    const q: Q = {
        text: '',
        page: 1,
        state: ['normal'],
        sex: ['male', 'female', 'unknown']
    };

    let ref: RemoteTableRef<Admin>;

    return <Page title="_i.page.admin.adminsManager">
        <RemoteTable<Admin, Q> ref={(el)=>ref=el} inSearch paging path='/admins' queries={q} systemToolbar toolbar={
            <LinkButton palette='primary' href={`${props.routePrefix}/0`}>{ctx.locale().t('_i.page.newItem')}</LinkButton>
        } queryForm={(qa) => (
            <>
                <TextField accessor={qa.accessor<string>('text')} />
                <Choice options={buildEnumsOptions(statesMap, ctx)} multiple accessor={qa.accessor<Array<State>>('state')} />
                <Choice options={buildEnumsOptions(sexesMap, ctx)} multiple accessor={qa.accessor<Array<Sex>>('sex')} />
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
            { id: 'nickname', label: ctx.locale().t('_i.page.admin.nickname') },
            { id: 'created', label: ctx.locale().t('_i.page.created'), content: (_, v)=> ctx.locale().datetime(v) },
            {
                id: 'state', label: ctx.locale().t('_i.page.state'), content: (_, v) => {
                    return translateEnum(statesMap, ctx, v as State);
                }
            },
            {
                id: 'actions', label: ctx.locale().t('_i.page.actions'), isUnexported: true, renderContent: ((_, __, obj?: Admin) => {
                    return <div class="flex gap-x-2">
                        <LinkButton icon rounded palette='tertiary'
                            href={`${props.routePrefix}/${obj!['id']}`}
                            title={ctx.locale().t('_i.page.editItem')}>edit</LinkButton>

                        <Show when={obj?.state !== 'locked'}>
                            <Button icon rounded palette='error' title={ctx.locale().t('_i.page.admin.lockUser')} onClick={async()=>{
                                const r = await ctx.api.post(`/admins/${obj!['id']}/locked`);
                                if (!r.ok) {
                                    ctx.outputProblem(r.body);
                                    return;
                                }
                                ref.refresh();
                            }}>lock</Button>
                        </Show>

                        <Show when={obj?.state === 'locked'}>
                            <Button icon rounded palette='tertiary' title={ctx.locale().t('_i.page.admin.unlockUser')} onClick={async()=>{
                                const r = await ctx.api.delete(`/admins/${obj!['id']}/locked`);
                                if (!r.ok) {
                                    ctx.outputProblem(r.body);
                                    return;
                                }
                                ref.refresh();
                            }}>lock_open_right</Button>
                        </Show>

                        <ConfirmButton icon rounded palette='error' title={ctx.locale().t('_i.page.admin.resetPassword')}
                            prompt={ctx.locale().t('_i.page.admin.areYouSureResetPassword')}
                            onClick={async()=>{
                                const r = await ctx.api.delete(`/admins/${obj!['id']}/password`);
                                if (!r.ok) {
                                    ctx.outputProblem(r.body);
                                    return;
                                }
                                ctx.notify(ctx.locale().t('_i.page.admin.successfullyResetPassword'), undefined, 'success');
                            }}>lock_reset</ConfirmButton>

                        {ref.DeleteAction(obj!['id'])}
                    </div>;
                })
            },
        ]} />
    </Page>;
}
