// SPDX-FileCopyrightText: 2025 caixw
//
// SPDX-License-Identifier: MIT

import {
    Appbar, Button, Dropdown, LinkButton, Menu, Notify, OptionsProvider, SystemDialog, use, useLocale
} from '@cmfx/components';
import { HashRouter, RouteDefinition, RouteSectionProps } from '@solidjs/router';
import { createSignal, JSX, lazy, ParentProps } from 'solid-js';
import { render } from 'solid-js/web';
import IconGithub from '~icons/icon-park-outline/github';
import IconLanguage from '~icons/material-symbols/language';
import IconTheme from '~icons/material-symbols/palette';
import IconLTR from '~icons/ooui/text-flow-ltr';
import IconRTL from '~icons/ooui/text-flow-rtl';

import { default as demoRoute } from './demo';
import { default as docsRoute } from './docs';
import { options } from './options';
import './style.css';

const routes: Array<RouteDefinition> = [
    { path: '/', component: lazy(() => import('./home')) },
    docsRoute('/docs'),
    demoRoute('/demo'),
];

function App(): JSX.Element {
    const Root = (props: RouteSectionProps) => {
        return <OptionsProvider {...options}>
            <SystemDialog header={options.title}>
                <Notify system timeout={5000} palette='error'>
                    <InternalApp {...props} />
                </Notify>
            </SystemDialog>
        </OptionsProvider>;
    };

    return <HashRouter root={Root}>{routes}</HashRouter>;
}

function InternalApp(props: ParentProps): JSX.Element {
    const l = useLocale();
    const [, act, opt] = use();
    const [ltr, setLTR] = createSignal(true);

    return <div class="flex flex-col h-full w-full">
        <Appbar title={options.title} actions={
            <div class="flex gap-2 mr-2">
                <Dropdown hoverable value={[l.locale.toString()]} onChange={e=>act.switchLocale(e)}
                    items={l.locales.map(locale => ({
                        type: 'item',
                        label: locale[1],
                        value: locale[0],
                    }))}>
                    <Button kind='flat' square rounded><IconLanguage /></Button>
                </Dropdown>

                <Dropdown hoverable value={opt.mode ? [opt.mode] : []} onChange={e=>act.switchMode(e)}
                    items={[
                        { type: 'item', label: l.t('_d.main.dark'), value: 'dark' },
                        { type: 'item', label: l.t('_d.main.light'), value: 'light' },
                        { type: 'item', label: l.t('_d.main.system'), value: 'system' },
                        { type: 'divider' },
                        { type: 'item', label: l.t('_d.main.themeBuilder'), value: 'theme-builder' },
                    ]}>
                    <Button kind='flat' square rounded><IconTheme /></Button>
                </Dropdown>

                <Button kind='flat' square rounded onClick={e=>{
                    setLTR(!ltr());
                    // TODO
                }}>
                    {ltr() ? <IconLTR /> : <IconRTL />}
                </Button>

                <LinkButton kind='flat' square rounded href='https://github.com/issue9/cmfx'>
                    <IconGithub />
                </LinkButton>
            </div>
        }>
            <Menu class='ml-5' anchor layout='horizontal' items={[
                { type: 'item', label: l.t('_d.main.home'), value: '/' },
                { type: 'item', label: l.t('_d.main.docs'), value: '/docs' },
                { type: 'item', label: l.t('_d.main.components'), value: '/demo' },
            ]} />
        </Appbar>
        {props.children}
    </div>;
}

render(() => (<App />), document.getElementById('app')!);
