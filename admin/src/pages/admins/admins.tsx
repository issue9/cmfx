// SPDX-FileCopyrightText: 2024 caixw
//
// SPDX-License-Identifier: MIT

import { JSX } from 'solid-js';

import { useApp } from '@/app';
import { DataTable } from '@/components';
import { Page } from '@/core';
import type { Admin, Sex, State } from './types';

export default function(): JSX.Element {
    const ctx = useApp();

    return <DataTable queries={{}} columns={[
        {id: 'id',label: ctx.t('_i.page.id')},
        {id: 'no',label: ctx.t('_i.page.no')},
        {id: 'sex',label: ctx.t('_i.page.sex'), render: (id: string, v?: Sex)=>{
            switch(v) {
            case 'male':
                return ctx.t('_i.page.sexes.male');
            case 'female':
                return ctx.t('_i.page.sexes.female');
            case 'unknown':
                return ctx.t('_i.page.sexes.unknown');
            }
        }},
        {id: 'name', label: ctx.t('_i.page.admin.name')},
        {id: 'nickname', label: ctx.t('_i.page.admin.nickname')},
        {id: 'created', label: ctx.t('_i.page.created')},
        {id: 'state', label: ctx.t('_i.page.state'), render: (id: string, v?: State)=>{
            switch(v) {
            case 'normal':
                return ctx.t('_i.page.states.normal');
            case 'locked':
                return ctx.t('_i.page.states.locked');
            case 'deleted':
                return ctx.t('_i.page.states.deleted');
            }
        }},
    ]} load={async() => {
        const ret = await ctx.get<Page<Admin>>('/admins');
        if (!ret.ok) {
            ctx.outputProblem(ret.status, ret.body);
            return [];
        }
        return ret.body;
    }} />;
}
