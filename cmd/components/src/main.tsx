// SPDX-FileCopyrightText: 2025 caixw
//
// SPDX-License-Identifier: MIT

import { Drawer, Item, List, build } from '@cmfx/components';
import { API, Config, Dict, Locale, Problem, Theme } from '@cmfx/core';
import { HashRouter, RouteSectionProps } from '@solidjs/router';
import { JSX } from 'solid-js';
import { render } from 'solid-js/web';

import './style.css';

import { routes } from '@cmfx/components/demo';

const conf = new Config('id');
const api = await API.build('token', 'http://localhost:8080', '/login', 'application/json', 'application/json', 'zh-Hans');
Theme.init(conf, Theme.genScheme(10));
Locale.init('zh-Hans', api);
Locale.addDict('zh-Hans',
    (): Promise<Dict> => { return import('@cmfx/components/messages/zh-Hans.lang').default; },
);
Locale.addDict('en-US',
    (): Promise<Dict> => { return import('@cmfx/components/messages/en.lang').default; },
);

function App(): JSX.Element {
    const ret = build(conf, {
        title: 'title',
        titleSeparator: '-',
        pageSizes: [10, 20, 50, 100, 200, 500],
        pageSize: 20,
        api: api,
        outputProblem: function <P>(p?: Problem<P>): Promise<void> {
            throw new Error('Function not implemented.');
        }
    });
    const menuItems: Array<Item> = [];
    routes.sort().forEach((r) => {
        menuItems.push({
            type: 'item',
            label: r.path as string,
            value: r.path
        });
    });

    const Root = (p: RouteSectionProps) => {
        return <ret.Provider>
            <Drawer main={p.children}>
                <List anchor>{ menuItems }</List>
            </Drawer>
        </ret.Provider>;
    };

    return <HashRouter root={Root}>{routes}</HashRouter>;
}

render(() => (<App />), document.getElementById('app')!);
