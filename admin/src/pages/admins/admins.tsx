// SPDX-FileCopyrightText: 2024 caixw
//
// SPDX-License-Identifier: MIT

import { JSX } from 'solid-js';

import { useApp } from '@/app';
import { Button, Choice, Column, DataTable, TextField } from '@/components';
import { Page } from '@/core';
import type { Admin, Query, Sex, State } from './types';
import { buildSexOptions, buildStateOptions } from './types';

export default function(): JSX.Element {
    const ctx = useApp();

    const q: Query = {
        page: 1,
        states: ['normal'],
        sexes: ['male', 'female', 'unknown']
    };

    return <DataTable paging queries={q} systemToolbar toolbar={
        <>
            <Button palette='primary'>{ ctx.t('_i.page.newItem') }</Button>
        </>
    } queryForm={(qa)=>(
        <>
            <TextField accessor={qa.accessor<string>('text')} />
            <Choice options={buildStateOptions(ctx)} multiple accessor={qa.accessor<State>('states')} />
            <Choice options={buildSexOptions(ctx)} multiple accessor={qa.accessor<Sex>('sexes')} />
        </>
    )} columns={[
        {id: 'id',label: ctx.t('_i.page.id')},
        {id: 'no',label: ctx.t('_i.page.no')},
        {id: 'sex',label: ctx.t('_i.page.sex'), content: ((_: string, v?: Sex)=>{
            switch(v) {
            case 'male':
                return ctx.t('_i.page.sexes.male');
            case 'female':
                return ctx.t('_i.page.sexes.female');
            case 'unknown':
                return ctx.t('_i.page.sexes.unknown');
            }
        }) as Column<Admin>['content']},
        {id: 'name', label: ctx.t('_i.page.admin.name')},
        {id: 'nickname', label: ctx.t('_i.page.admin.nickname')},
        {id: 'created', label: ctx.t('_i.page.created')},
        {id: 'state', label: ctx.t('_i.page.state'), content: ((_: string, v?: State)=>{
            switch(v) {
            case 'normal':
                return ctx.t('_i.page.states.normal');
            case 'locked':
                return ctx.t('_i.page.states.locked');
            case 'deleted':
                return ctx.t('_i.page.states.deleted');
            }
        }) as Column<Admin>['content']},
    ]} load={async() => {
        const ret = await ctx.get<Page<Admin>>('/admins');
        if (!ret.ok) {
            ctx.outputProblem(ret.status, ret.body);
            return [];
        }
        return ret.body;
    }} />;
}
