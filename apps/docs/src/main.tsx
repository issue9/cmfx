// SPDX-FileCopyrightText: 2025-2026 caixw
//
// SPDX-License-Identifier: MIT

import './style.css';

import {
    Appbar, Button, DrawerRef, Dropdown, DropdownRef, Menu, MenuItem, MenuItemItem, Mode, modes,
    Result, run, Search, ToggleFullScreenButton, Transition, useLocale, useOptions, useTheme
} from '@cmfx/components';
import * as illustrations from '@cmfx/illustrations';
import { RouteDefinition, RouteSectionProps, useNavigate } from '@solidjs/router';
import { createMemo, createSignal, JSX, lazy, Show } from 'solid-js';
import IconZH from '~icons/icon-park-outline/chinese';
import IconEN from '~icons/icon-park-outline/english';
import IconGithub from '~icons/icon-park-outline/github';
import IconSystem from '~icons/material-symbols/brightness-4';
import IconDark from '~icons/material-symbols/dark-mode';
import IconAlign from '~icons/material-symbols/format-align-center-rounded';
import IconAuto from '~icons/material-symbols/format-align-justify-rounded';
import IconLTR from '~icons/material-symbols/format-align-left-rounded';
import IconRTL from '~icons/material-symbols/format-align-right-rounded';
import IconLanguage from '~icons/material-symbols/language';
import IconLight from '~icons/material-symbols/light-mode';
import IconTheme from '~icons/material-symbols/palette';
import IconBuilder from '~icons/mdi/theme';

import pkg from '../package.json';
import { buildMenus as buildComponentsMenus, buildRoute as buildComponentsRoute } from './components';
import { buildRoute as buildContributeRoute } from './contribute';
import { buildMenus as buildDocsMenus, buildRoute as buildDocsRoute } from './docs';
import { options } from './options';
import { buildRoute as buildThemeRoute } from './theme/builder';

import { Hotkey } from '@cmfx/core';
import styles from './style.module.css';

const languageIcons: ReadonlyMap<string, JSX.Element> = new Map([
    ['en', <IconEN />],
    ['zh-Hans', <IconZH />],
]);

const docsRoute = '/docs';
const componentsRoute = '/components/demo/';
const contributeRoute = '/contribute';
const themeRoute = '/theme-builder';

const [docsRef, setDocsRef] = createSignal<DrawerRef>();
const [demoRef, setDemoRef] = createSignal<DrawerRef>();
const [themeRef, setThemeRef] = createSignal<DrawerRef>();

function InternalApp(props: RouteSectionProps): JSX.Element {
    const l = useLocale();
    const [act] = useOptions();
    const [dir, setDir] = createSignal<'ltr' | 'rtl' | 'auto'>('auto');
    const theme = useTheme();

    const menus: Array<MenuItem<string>> = [
        ...buildComponentsMenus(l, componentsRoute),
        ...buildDocsMenus(l, docsRoute),
        { type: 'a', value: contributeRoute, label: l.t('_d.contribute.contribute') },
    ];
    const search = async (value: string) => {
        const items: Array<MenuItemItem<string>> = [];

        for (const m of menus) {
            if (m.type === 'a' && m.label && (m.label as string).toLowerCase().includes(value.toLowerCase())) {
                items.push({ type: 'a', value: m.value, label: m.label });
            } else if (m.type === 'group' && m.items) {
                // 目前只有两级菜单
                for (const mm of m.items) {
                    const match = mm.type === 'a'
                        && mm.label
                        && (mm.label as string).toLowerCase().includes(value.toLowerCase());
                    if (match) {
                        items.push({ type: 'a', value: mm.value, label: mm.label });
                    }
                }
            }
        }

        return items;
    };

    const [themeValues, setThemeValues]
        = createSignal<Array<Mode>>([theme.mode ?? 'system'], { equals: false });
    let themeDropdown: DropdownRef;

    return <div class={styles.main}>
        <Appbar href='/' palette='secondary' logo={options.logo} title={options.title} actions={
            <>
                <Show when={docsRef()}>{r => { return r().ToggleButton({ square: true, kind: 'flat' }); }}</Show>
                <Show when={demoRef()}>{r => { return r().ToggleButton({ square: true, kind: 'flat' }); }}</Show>
                <Show when={themeRef()}>{r => { return r().ToggleButton({ square: true, kind: 'flat' }); }}</Show>

                <Dropdown trigger='hover' value={[l.match(Array.from(languageIcons.keys()))]}
                    onChange={e => act.setLocale(e)} items={l.locales.map(locale => ({
                        type: 'item',
                        label: locale[1],
                        value: locale[0],
                        prefix: languageIcons.get(locale[0]) ?? <IconLanguage />,
                    }))}
                >
                    <Button kind='flat' square><IconLanguage /></Button>
                </Dropdown>

                <Dropdown ref={el => themeDropdown = el} trigger='hover' multiple value={themeValues()}
                    onChange={(val, old) => {
                        const n = val.filter(v => modes.includes(v as any)); // 提取新值中的有关 Mode 类型的
                        const o = old ? old.filter(v => modes.includes(v as any)) : []; // 提取旧值中的有关 Mode 类型的
                        const m = n.filter(v => !o.includes(v)); // 提取只存在于新值中的 Mode 类型值
                        if (m && m.length > 0) { // 如果存在 m，则删除 val 中所有的 Mode 值，并添加 m 至 val。
                            const v = val.filter(v => !modes.includes(v as any));
                            const mode = m[0];
                            v.push(mode);
                            setThemeValues(v as any);
                            act.setMode(mode as Mode);
                        }

                        themeDropdown.hide();
                    }} items={[
                        { type: 'item', label: l.t('_d.main.dark'), value: 'dark', prefix: <IconDark /> },
                        { type: 'item', label: l.t('_d.main.light'), value: 'light', prefix: <IconLight /> },
                        { type: 'item', label: l.t('_d.main.system'), value: 'system', prefix: <IconSystem /> },
                        { type: 'divider' },
                        { type: 'a', label: l.t('_d.main.themeBuilder'), value: 'theme-builder', prefix: <IconBuilder /> },
                    ]}>
                    <Button kind='flat' square><IconTheme /></Button>
                </Dropdown>

                <Dropdown trigger='hover' value={[dir()]} onChange={e => {
                    setDir(e);
                    document.documentElement.setAttribute('dir', dir());
                }} items={[
                    { type: 'item', label: l.t('_d.main.ltr'), value: 'ltr', prefix: <IconLTR /> },
                    { type: 'item', label: l.t('_d.main.rtl'), value: 'rtl', prefix: <IconRTL /> },
                    { type: 'item', label: l.t('_d.main.auto'), value: 'auto', prefix: <IconAuto /> }
                ]}>
                    <Button kind='flat' square><IconAlign /></Button>
                </Dropdown>

                <ToggleFullScreenButton kind='flat' square title={l.t('_c.fullscreen')} />

                <Button type='a' kind='flat' square href={pkg.repository.url}><IconGithub /></Button>
            </>
        }>
            <Menu class='ms-5 me-5' layout='horizontal' items={[
                { type: 'a', label: l.t('_d.main.home'), value: '/' },
                { type: 'a', label: l.t('_d.contribute.contribute'), value: contributeRoute },
                { type: 'a', label: l.t('_d.main.docs'), value: docsRoute },
                { type: 'a', label: l.t('_d.main.components'), value: componentsRoute },
            ]} />

            <Search class={styles.search} onSearch={search} icon clear hotkey={new Hotkey('k', 'control')} />
        </Appbar>

        <Transition>{props.children}</Transition>
    </div>;
}

function NotFound(): JSX.Element {
    const l = useLocale();
    const nav = useNavigate();

    const text = createMemo(() => { return l.t('_d.error.pageNotFound'); });

    return <Result palette='error' title={text()} illustration={<illustrations.Error404 text={text()} />}>
        <div class={styles['error-actions']}>
            <Button palette='primary' type='a' href="/">{l.t('_d.error.backHome')}</Button>
            <Button palette='primary' type='button' onclick={() => { nav(-1); }}>{l.t('_d.error.backPrev')}</Button>
        </div>
    </Result>;
}

const routes: Array<RouteDefinition> = [
    { path: '/', component: lazy(() => import('./home')) },

    buildThemeRoute(themeRoute, setThemeRef),
    buildComponentsRoute(componentsRoute, setDemoRef),
    buildDocsRoute(docsRoute, setDocsRef),
    buildContributeRoute(contributeRoute),
    { path: '*', component: NotFound }
];

run((props: RouteSectionProps) => <InternalApp {...props} />, document.getElementById('app')!, options, routes);
