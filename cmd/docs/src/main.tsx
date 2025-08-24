// SPDX-FileCopyrightText: 2025 caixw
//
// SPDX-License-Identifier: MIT

import {
    Appbar, Button, Dropdown, IconComponent, LinkButton, Menu, Mode,
    Notify, OptionsProvider, SystemDialog, use, useLocale, useTheme
} from '@cmfx/components';
import { HashRouter, RouteDefinition, RouteSectionProps } from '@solidjs/router';
import { createSignal, JSX, lazy, ParentProps } from 'solid-js';
import { render } from 'solid-js/web';
import IconZH from '~icons/icon-park-outline/chinese';
import IconEN from '~icons/icon-park-outline/english';
import IconGithub from '~icons/icon-park-outline/github';
import IconSystem from '~icons/material-symbols/brightness-4';
import IconDark from '~icons/material-symbols/dark-mode';
import IconLanguage from '~icons/material-symbols/language';
import IconLight from '~icons/material-symbols/light-mode';
import IconTheme from '~icons/material-symbols/palette';
import IconBuilder from '~icons/mdi/theme';
import IconLTR from '~icons/ooui/text-flow-ltr';
import IconRTL from '~icons/ooui/text-flow-rtl';

import { default as demoRoute } from './demo';
import { default as docsRoute } from './docs';
import { options } from './options';
import './style.css';

const languageIcons: ReadonlyMap<string, IconComponent> = new Map([
    ['en', IconEN],
    ['zh-Hans', IconZH],
]);

const routes: Array<RouteDefinition> = [
    { path: '/', component: lazy(() => import('./home')) },
    { path: '/theme-builder', component: lazy(() => import('./theme/builder')) },
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
    const [, act] = use();
    const [ltr, setLTR] = createSignal(true);
    const theme = useTheme();

    // 主题菜单可能要出现同时两个菜单项同时选中的状态，比如打开了主题编辑器时。
    // 当前变量用于在打开主题编辑器时，将菜单的选中项设置为旧值。
    const [mode, setMode] = createSignal<Mode>(theme.mode ?? 'system', { equals: false });

    return <div class="flex flex-col h-full w-full">
        <Appbar palette='secondary' title={options.title} actions={
            <div class="flex gap-2 mr-2">
                <Dropdown hoverable value={[l.match(Array.from(languageIcons.keys()))]}
                    onChange={e=>act.switchLocale(e)}
                    items={l.locales.map(locale => ({
                        type: 'item',
                        label: locale[1],
                        value: locale[0],
                        icon: languageIcons.get(locale[0]) ?? IconLanguage,
                    }))}>
                    <Button kind='flat' square rounded><IconLanguage /></Button>
                </Dropdown>

                <Dropdown hoverable value={[mode()]} onChange={(val, old) => {
                    if (val === 'theme-builder') {
                        setMode(old ? (old == 'theme-builder' ? 'system' : old) : 'system');
                    } else {
                        act.switchMode(val);
                    }
                }}
                items={[
                    { type: 'item', label: l.t('_d.main.dark'), value: 'dark', icon: IconDark },
                    { type: 'item', label: l.t('_d.main.light'), value: 'light', icon: IconLight },
                    { type: 'item', label: l.t('_d.main.system'), value: 'system', icon: IconSystem },
                    { type: 'divider' },
                    { type: 'a', label: l.t('_d.main.themeBuilder'), value: 'theme-builder', icon: IconBuilder },
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
            <Menu class='ml-5' layout='horizontal' items={[
                { type: 'a', label: l.t('_d.main.home'), value: '/' },
                { type: 'a', label: l.t('_d.main.docs'), value: '/docs' },
                { type: 'a', label: l.t('_d.main.components'), value: '/demo' },
            ]} />
        </Appbar>
        {props.children}
    </div>;
}

render(() => (<App />), document.getElementById('app')!);
