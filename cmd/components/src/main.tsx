// SPDX-FileCopyrightText: 2025 caixw
//
// SPDX-License-Identifier: MIT

import { Drawer, Item, List, Options, OptionsProvider } from '@cmfx/components';
import { Problem, Theme } from '@cmfx/core';
import { HashRouter, RouteSectionProps } from '@solidjs/router';
import { JSX } from 'solid-js';
import { render } from 'solid-js/web';

import './style.css';

import { routes } from './demo';

// 调用的 API.build 需要 await，目前顶层代码不是允许的，
// 所以用 main 进行一次包装。
async function main() {
    const o: Options = {
        id: 'admin',
        configName: '',
        storage: window.sessionStorage,
        scheme: Theme.genScheme(10),
        contrast: 'nopreference',
        mode: 'dark',
        locale: 'zh-Hans',
        unitStyle: 'full',
        messages: {
            'en': [
                async () => (await import('@cmfx/components/messages/en.lang.js')).default
            ],
            'zh-Hans': [
                async () => (await import('@cmfx/components/messages/zh-Hans.lang.js')).default
            ],
        },

        apiBase: 'http://localhost:8080',
        apiToken: '/login',
        apiAcceptType: 'application/json',
        apiContentType: 'application/json',
        title: 'title',
        titleSeparator: '-',
        pageSizes: [10, 20, 50, 100, 200, 500],
        pageSize: 20,
        outputProblem: async function <P>(p?: Problem<P>): Promise<void> {
            console.error(p ? p.title : '');
        }
    };

    function App(): JSX.Element {
        const menuItems: Array<Item> = [];
        routes.forEach((r) => {
            menuItems.push({
                type: 'item',
                label: r.path as string,
                value: r.path
            });
        });

        const Root = (p: RouteSectionProps) => {
            return <OptionsProvider {...o}>
                <Drawer main={p.children}><List anchor>{menuItems}</List></Drawer>
            </OptionsProvider>;
        };

        return <HashRouter root={Root}>{routes}</HashRouter>;
    }

    render(() => (<App />), document.getElementById('app')!);
}

main();
