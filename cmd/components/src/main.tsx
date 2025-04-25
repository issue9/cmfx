// SPDX-FileCopyrightText: 2025 caixw
//
// SPDX-License-Identifier: MIT

import { Drawer, Item, List, init } from '@cmfx/components';
import { API, Config, Dict, Locale, Problem, Theme } from '@cmfx/core';
import { HashRouter, RouteSectionProps } from '@solidjs/router';
import { JSX } from 'solid-js';
import { render } from 'solid-js/web';

import './style.css';

import { routes } from './demo';

// 调用的 API.build 需要 await，目前顶层代码不是允许的，
// 所以用 main 进行一次包装。
async function main() {
    const conf = new Config('id');
    const api = await API.build('token', 'http://localhost:8080', '/login', 'application/json', 'application/json', 'zh-Hans');
    Theme.init(conf, Theme.genScheme(10));
    Locale.init('zh-Hans', api);
    await Locale.addDict('zh-Hans',
        async (): Promise<Dict> => { return (await import('@cmfx/components/messages/zh-Hans.lang.js')).default; },
    );
    await Locale.addDict('en-US',
        async (): Promise<Dict> => { return (await import('@cmfx/components/messages/en.lang.js')).default; },
    );

    function App(): JSX.Element {
        const ret = init({
            config: conf,
            title: 'title',
            titleSeparator: '-',
            pageSizes: [10, 20, 50, 100, 200, 500],
            pageSize: 20,
            api: api,
            outputProblem: function <P>(p?: Problem<P>): Promise<void> {
                throw new Error(p?.title);
            }
        });
        const menuItems: Array<Item> = [];
        routes.forEach((r) => {
            menuItems.push({
                type: 'item',
                label: r.path as string,
                value: r.path
            });
        });

        const Root = (p: RouteSectionProps) => {
            return <ret.Provider>
                <Drawer main={p.children}><List anchor>{menuItems}</List></Drawer>
            </ret.Provider>;
        };

        return <HashRouter root={Root}>{routes}</HashRouter>;
    }

    render(() => (<App />), document.getElementById('app')!);
}

main();
