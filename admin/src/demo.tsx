// SPDX-FileCopyrightText: 2024 caixw
//
// SPDX-License-Identifier: MIT

import { A } from '@solidjs/router';
import { JSX } from 'solid-js';

import { default as App } from '@/app/demo';
import { default as Badge } from '@/components/badge/demo';
import { default as Buttons } from '@/components/button/demo';
import { default as Divider } from '@/components/divider/demo';
import { default as Dropdown } from '@/components/dropdown/demo';
import { default as Error } from '@/components/errorpage/demo';
import { default as List } from '@/components/list/demo';

// form 相关
import { default as Checkbox } from '@/components/form/checkbox/demo';
import { default as Choice } from '@/components/form/choice/demo';
import { default as Form } from '@/components/form/demo';
import { default as Raido } from '@/components/form/radio/demo';
import { default as TextArea } from '@/components/form/textarea/demo';
import { default as TextField } from '@/components/form/textfield/demo';

/**
* 构建用于 Demo 展示的路由项
*
* @param prefix 路由前缀
* @returns 路由配置项
*/
export default function(prefix: string) {
    const nav = (props: {children?: JSX.Element}) => {
        return <div class="h-full flex flex-col">
            <p class="justify-center flex flex-wrap scheme--surface gap-4">demo:
                <A href={prefix + '/app'}>APP</A>
                <A href={prefix + '/errors'}>errors</A>
                <A href={prefix + '/buttons'}>buttons</A>
                <A href={prefix + '/dropdown'}>dropdown</A>
                <A href={prefix + '/badge'}>badge</A>
                <A href={prefix + '/list'}>list</A>
                <A href={prefix + '/form'}>form</A>
                <A href={prefix + '/form-textfield'}>textfield</A>
                <A href={prefix + '/form-textarea'}>textarea</A>
                <A href={prefix + '/form-radio'}>radio</A>
                <A href={prefix + '/form-checkbox'}>checkbox</A>
                <A href={prefix + '/form-choice'}>choice</A>
                <A href={prefix + '/divider'}>divider</A>
            </p>
            <div class="mt-8 p-4 overflow-y-scroll h-full">
                {props.children}
            </div>
        </div>;
    };

    return {
        path: prefix,
        component: nav,
        children: [
            {
                path: '/app',
                component: App,
            },
            {
                path: '/errors',
                component: Error,
            },
            {
                path: '/buttons',
                component: Buttons,
            },
            {
                path: '/divider',
                component: Divider,
            },
            {
                path: '/dropdown',
                component: Dropdown,
            },
            {
                path: '/badge',
                component: Badge,
            },
            {
                path: '/list',
                component: List,
            },

            {
                path: '/form-textfield',
                component: TextField,
            },
            {
                path: '/form-textarea',
                component: TextArea,
            },
            {
                path: '/form-radio',
                component: Raido,
            },
            {
                path: '/form-checkbox',
                component: Checkbox,
            },
            {
                path: '/form-choice',
                component: Choice,
            },
            {
                path: '/form',
                component: Form,
            },
        ]
    };
}
