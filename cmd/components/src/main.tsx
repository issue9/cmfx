// SPDX-FileCopyrightText: 2025 caixw
//
// SPDX-License-Identifier: MIT

import { Drawer, List, Notify, OptionsProvider, SystemDialog, TreeItem } from '@cmfx/components';
import { HashRouter, RouteSectionProps } from '@solidjs/router';
import { JSX } from 'solid-js';
import { render } from 'solid-js/web';

import { routes } from './demo';
import { options } from './options';
import './style.css';

const menuItems: Array<TreeItem> = [];
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
            <SystemDialog header='system dialog title'>
                <Notify system timeout={5000} palette='error'>
                    <Drawer visible palette='tertiary' main={p.children}><List anchor>{menuItems}</List></Drawer>
                </Notify>
            </SystemDialog>
        </OptionsProvider>;
    };

    return <HashRouter root={Root}>{routes}</HashRouter>;
}

render(() => (<App />), document.getElementById('app')!);
