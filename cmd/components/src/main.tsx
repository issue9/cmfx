// SPDX-FileCopyrightText: 2025 caixw
//
// SPDX-License-Identifier: MIT

import { Drawer, Item, List, OptionsProvider } from '@cmfx/components';
import { HashRouter, RouteSectionProps } from '@solidjs/router';
import { JSX } from 'solid-js';
import { render } from 'solid-js/web';

import { routes } from './demo';
import { options } from './options';
import './style.css';

const menuItems: Array<Item> = [];
routes.forEach((r) => {
    menuItems.push({
        type: 'item',
        label: r.path as string,
        value: r.path
    });
});

function App(): JSX.Element {
    const Root = (p: RouteSectionProps) => {
        return <OptionsProvider {...options}>
            <Drawer palette='tertiary' main={p.children}><List anchor>{menuItems}</List></Drawer>
        </OptionsProvider>;
    };

    return <HashRouter root={Root}>{routes}</HashRouter>;
}

render(() => (<App />), document.getElementById('app')!);
