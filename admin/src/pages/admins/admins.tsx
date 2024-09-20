// SPDX-FileCopyrightText: 2024 caixw
//
// SPDX-License-Identifier: MIT

import { JSX } from 'solid-js';

import { useApp } from '@/app';
import {
    buildEnumsOptions, Choice, Column, LinkButton,
    Page, RemoteTable, RemoteTableMethods, TextField, translateEnum
} from '@/components';
import type { Admin, Query, Sex, State } from './types';
import { sexesMap, statesMap } from './types';

interface Props {
    /**
     * 路由基地址
     */
    routePrefix: string;
}

export default function(props: Props): JSX.Element {
    const ctx = useApp();

    const q: Query = {
        text: '',
        page: 1,
        state: ['normal'],
        sex: ['male', 'female', 'unknown']
    };

    let ref: RemoteTableMethods<Admin>;

    return <Page title="_i.page.admin.adminsManager">
        <RemoteTable ref={(el)=>ref=el} inSearch paging path='/admins' queries={q} systemToolbar toolbar={
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
                id: 'sex', label: ctx.locale().t('_i.page.sex'), content: ((_: string, v?: Sex) => {
                    return translateEnum(sexesMap, ctx, v);
                }) as Column<Admin>['content']
            },
            { id: 'name', label: ctx.locale().t('_i.page.admin.name') },
            { id: 'nickname', label: ctx.locale().t('_i.page.admin.nickname') },
            { id: 'created', label: ctx.locale().t('_i.page.created') },
            {
                id: 'state', label: ctx.locale().t('_i.page.state'), content: ((_: string, v?: State) => {
                    return translateEnum(statesMap, ctx, v);
                }) as Column<Admin>['content']
            },
            {
                id: 'actions', label: ctx.locale().t('_i.page.actions'), isUnexported: true, renderContent: ((_, __, obj) => {
                    return <div class="flex gap-x-2">
                        <LinkButton icon rounded palette='tertiary' href={`${props.routePrefix}/${obj!['id']}`} title={ctx.locale().t('_i.page.editItem')}>edit</LinkButton>
                        {ref.DeleteAction(obj!['id'])}
                    </div>;
                }) as Column<Admin>['renderContent']
            },
        ]} />
    </Page>;
}
