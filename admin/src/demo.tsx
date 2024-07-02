// SPDX-FileCopyrightText: 2024 caixw
//
// SPDX-License-Identifier: MIT

import { A } from '@solidjs/router';
import { JSX } from 'solid-js';

import { default as App } from '@/app/demo';
import { default as Buttons } from '@/components/button/demo';
import { default as Divider } from '@/components/divider/demo';
import { default as Errors } from '@/components/error/demo';
import { default as Form } from '@/components/form/demo';

/**
* 构建用于 Demo 展示的路由项
*
* @param prefix 路由前缀
* @returns 路由配置项
*/
export default function(prefix: string) {
    const nav = (props: {children?: JSX.Element}) => {
        return <div>
            <p class="justify-center flex fixed scheme--surface gap-4">demo:
                <A href={prefix + '/app'}>APP</A>
                <A href={prefix + '/errors'}>errors</A>
                <A href={prefix + '/buttons'}>buttons</A>
                <A href={prefix + '/form'}>form</A>
                <A href={prefix + '/divider'}>divider</A>
            </p>
            <div class="mt-8 p-4 overflow-y-scroll h-full">
                {props.children}
            </div >
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
                component: Errors,
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
                path: '/form',
                component: Form,
            }
        ]
    };
}
