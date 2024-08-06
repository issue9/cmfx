// SPDX-FileCopyrightText: 2024 caixw
//
// SPDX-License-Identifier: MIT

import { A } from '@solidjs/router';
import { For, JSX, lazy } from 'solid-js';

const maps: Array<[string, ReturnType<typeof lazy>]> = [
    ['/app', lazy(()=>import('@/app/demo'))],
    ['/base', lazy(()=>import('@/components/base/demo'))],
    ['/errors', lazy(()=>import('@/components/error/demo'))],
    ['/button', lazy(()=>import('@/components/button/demo'))],
    ['/dropdown', lazy(()=>import('@/components/dropdown/demo'))],
    ['/dialog', lazy(()=>import('@/components/dialog/demo'))],
    ['/badge', lazy(()=>import('@/components/badge/demo'))],
    ['/divider', lazy(()=>import('@/components/divider/demo'))],
    ['/pagination', lazy(()=>import('@/components/pagination/demo'))],

    ['/tree-list', lazy(()=>import('@/components/tree/list/demo'))],
    ['/tree-menu', lazy(()=>import('@/components/tree/menu/demo'))],

    ['/form', lazy(()=>import('@/components/form/demo'))],
    ['/form-textfield', lazy(()=>import('@/components/form/textfield/demo'))],
    ['/form-textarea', lazy(()=>import('@/components/form/textarea/demo'))],
    ['/form-editor', lazy(()=>import('@/components/form/editor/demo'))],
    ['/form-radio', lazy(()=>import('@/components/form/radio/demo'))],
    ['/form-checkbox', lazy(()=>import('@/components/form/checkbox/demo'))],
    ['/form-choice', lazy(()=>import('@/components/form/choice/demo'))],
    ['/form-date', lazy(()=>import('@/components/form/date/demo'))],
] as const;

/**
* 构建用于 Demo 展示的路由项
*
* @param prefix 路由前缀
* @returns 路由配置项
*/
export default function(prefix: string) {
    const nav = (props: {children?: JSX.Element}) => {
        return <div class="h-full flex flex-col">
            <p class="justify-center flex flex-wrap palette--surface gap-4">demo:
                <For each={maps}>
                    {(item) => (<A href={prefix + item[0]}>{item[0]}</A>)}
                </For>
            </p>
            <div class="mt-8 p-4 overflow-y-scroll h-full">
                {props.children}
            </div>
        </div>;
    };

    const children: Array<{path: string, component:ReturnType<typeof lazy>}> = [];
    maps.forEach((item) => {
        children.push({ path: item[0], component: item[1] });
    });

    return {
        path: prefix,
        component: nav,
        children: children
    };
}
