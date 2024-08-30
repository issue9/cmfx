// SPDX-FileCopyrightText: 2024 caixw
//
// SPDX-License-Identifier: MIT

import { createEffect, JSX } from 'solid-js';

import { useApp } from '@/app';
import { buildEnumsOptions, Button, Choice, Column, RemoteTable, RemoteTableMethods, TextField, translateEnum } from '@/components';
import type { Admin, Query, Sex, State } from './types';
import { sexesMap, statesMap } from './types';

export default function(): JSX.Element {
    const ctx = useApp();

    createEffect(() => {
        ctx.title = ctx.t('_i.page.admin.title')!;
    });

    const q: Query = {
        text: '',
        page: 1,
        state: ['normal'],
        sex: ['male', 'female', 'unknown']
    };

    let ref: RemoteTableMethods;

    return <div class="page">
        <RemoteTable ref={(el)=>ref=el} inSearch paging path='/admins' queries={q} systemToolbar toolbar={
            <>
                <Button palette='primary'>{ctx.t('_i.page.newItem')}</Button>
            </>
        } queryForm={(qa) => (
            <>
                <TextField accessor={qa.accessor<string>('text')} />
                <Choice options={buildEnumsOptions(statesMap, ctx)} multiple accessor={qa.accessor<Array<State>>('state')} />
                <Choice options={buildEnumsOptions(sexesMap, ctx)} multiple accessor={qa.accessor<Array<Sex>>('sex')} />
            </>
        )} columns={[
            { id: 'id', label: ctx.t('_i.page.id') },
            { id: 'no', label: ctx.t('_i.page.no') },
            {
                id: 'sex', label: ctx.t('_i.page.sex'), content: ((_: string, v?: Sex) => {
                    return translateEnum(sexesMap, ctx, v);
                }) as Column<Admin>['content']
            },
            { id: 'name', label: ctx.t('_i.page.admin.name') },
            { id: 'nickname', label: ctx.t('_i.page.admin.nickname') },
            { id: 'created', label: ctx.t('_i.page.created') },
            {
                id: 'state', label: ctx.t('_i.page.state'), content: ((_: string, v?: State) => {
                    return translateEnum(statesMap, ctx, v);
                }) as Column<Admin>['content']
            },
            {
                id: 'actions', label: ctx.t('_i.page.actions'), isUnexported: true, renderContent: ((id, val, obj) => {
                    return <div class="flex gap-x-2">
                        <Button icon rounded palette='tertiary' title={ctx.t('_i.page.editItem')}>edit</Button>
                        {ref.DeleteAction(obj!['id'])}
                    </div>;
                }) as Column<Admin>['renderContent']
            },
        ]} />
    </div>;
}
