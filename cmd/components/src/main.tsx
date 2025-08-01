// SPDX-FileCopyrightText: 2025 caixw
//
// SPDX-License-Identifier: MIT

import { Drawer, Menu, MenuItem, Notify, OptionsProvider, SystemDialog } from '@cmfx/components';
import { HashRouter, RouteSectionProps } from '@solidjs/router';
import { JSX } from 'solid-js';
import { render } from 'solid-js/web';

import { routes } from './demo';
import { options } from './options';
import './style.css';

const menuItems: Array<MenuItem> = [];
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
                    <Drawer visible palette='secondary' mainPalette='tertiary'  main={p.children}>
                        <Menu layout='inline' anchor items={menuItems} />
                    </Drawer>
                </Notify>
            </SystemDialog>
        </OptionsProvider>;
    };

    return <HashRouter root={Root}>{routes}</HashRouter>;
}

render(() => (<App />), document.getElementById('app')!);
