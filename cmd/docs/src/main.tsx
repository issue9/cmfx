// SPDX-FileCopyrightText: 2025 caixw
//
// SPDX-License-Identifier: MIT

import './style.css';

import {
    Appbar, Button, Dropdown, DropdownRef, fieldAccessor, LinkButton, Menu, MenuItemItem, Mode, modes,
    run, TextField, ToggleFullScreenButton, useComponents, useLocale, useTheme
} from '@cmfx/components';
import { RouteDefinition, RouteSectionProps } from '@solidjs/router';
import { createSignal, JSX, lazy, Show } from 'solid-js';
import IconZH from '~icons/icon-park-outline/chinese';
import IconEN from '~icons/icon-park-outline/english';
import IconGithub from '~icons/icon-park-outline/github';
import IconAnimation from '~icons/material-symbols/animation';
import IconSystem from '~icons/material-symbols/brightness-4';
import IconClear from '~icons/material-symbols/close';
import IconDark from '~icons/material-symbols/dark-mode';
import IconAlign from '~icons/material-symbols/format-align-center-rounded';
import IconAuto from '~icons/material-symbols/format-align-justify-rounded';
import IconLTR from '~icons/material-symbols/format-align-left-rounded';
import IconRTL from '~icons/material-symbols/format-align-right-rounded';
import IconLanguage from '~icons/material-symbols/language';
import IconLight from '~icons/material-symbols/light-mode';
import IconTheme from '~icons/material-symbols/palette';
import IconSearch from '~icons/material-symbols/search';
import IconBuilder from '~icons/mdi/theme';

import pkg from '../package.json';
import { buildMenus as buildDemoMenus, buildRoute as buildDemoRoute } from './demo';
import { buildMenus as buildDocsMenus, buildRoute as buildDocsRoute } from './docs';
import { options } from './options';

import styles from './style.module.css';

const languageIcons: ReadonlyMap<string, JSX.Element> = new Map([
    ['en', <IconEN />],
    ['zh-Hans', <IconZH />],
]);

const docsRoute = '/docs';
const demoRoute = '/demo';
const themeRoute = '/theme-builder';

function InternalApp(props: RouteSectionProps): JSX.Element {
    const l = useLocale();
    const [, act] = useComponents();
    const [dir, setDir] = createSignal<'ltr' | 'rtl' | 'auto'>('auto');
    const theme = useTheme();

    const menus = [...buildDemoMenus(l, demoRoute), ...buildDocsMenus(l, docsRoute)];
    const [candidate, setCandidate] = createSignal<Array<MenuItemItem<string>>>([]);
    let dropdownRef: DropdownRef;
    const searchFA = fieldAccessor('search', '');
    searchFA.onChange(value => {
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

        setCandidate(items);
        if (items.length > 0) { dropdownRef.show(); }
    });

    const [themeValues, setThemeValues] = createSignal<Array<Mode | 'reduced-motion'>>([theme.mode ?? 'system'], { equals: false });
    let themeDropdown: DropdownRef;

    return <div class={styles.main}>
        <Appbar href='/' palette='secondary' title={options.title} actions={
            <>
                <Dropdown trigger='hover' value={[l.match(Array.from(languageIcons.keys()))]}
                    onChange={e => act.switchLocale(e)} items={l.locales.map(locale => ({
                        type: 'item',
                        label: locale[1],
                        value: locale[0],
                        prefix: languageIcons.get(locale[0]) ?? <IconLanguage />,
                    }))}
                >
                    <Button kind='flat' square><IconLanguage /></Button>
                </Dropdown>

                <Dropdown ref={el => themeDropdown = el} trigger='hover' multiple value={themeValues()} onChange={(val, old) => {
                    const n = val.filter(v => modes.includes(v as any)); // 提取新值中的有关 Mode 类型的
                    const o = old ? old.filter(v => modes.includes(v as any)) : []; // 提取旧值中的有关 Mode 类型的
                    const m = n.filter(v => !o.includes(v)); // 提取只存在于新值中的 Mode 类型值
                    if (m && m.length > 0) { // 如果存在 m，则删除 val 中所有的 Mode 值，并添加 m 至 val。
                        const v = val.filter(v => !modes.includes(v as any));
                        const mode = m[0];
                        v.push(mode);
                        setThemeValues(v as any);
                        act.switchMode(mode as Mode);
                    }

                    if (val.includes('reduced-motion')) {
                        document.documentElement.classList.add('prefers-reduced-motion');
                    } else {
                        document.documentElement.classList.remove('prefers-reduced-motion');
                    }

                    themeDropdown.hide();
                }} items={[
                    { type: 'item', label: l.t('_d.main.dark'), value: 'dark', prefix: <IconDark /> },
                    { type: 'item', label: l.t('_d.main.light'), value: 'light', prefix: <IconLight /> },
                    { type: 'item', label: l.t('_d.main.system'), value: 'system', prefix: <IconSystem /> },
                    { type: 'divider' },
                    { type: 'item', label: l.t('_d.main.reducedMotion'), value: 'reduced-motion', prefix: <IconAnimation /> },
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

                <LinkButton kind='flat' square href={pkg.repository.url}><IconGithub /></LinkButton>
            </>
        }>
            <Menu class='ms-5 me-5' layout='horizontal' items={[
                { type: 'a', label: l.t('_d.main.home'), value: '/' },
                { type: 'a', label: l.t('_d.main.docs'), value: docsRoute },
                { type: 'a', label: l.t('_d.main.components'), value: demoRoute },
            ]} />

            <Dropdown class={styles['search-dropdown']} trigger='custom' items={candidate()} ref={el => {
                dropdownRef = el;
                dropdownRef.menu().element().style.height = '240px';
                dropdownRef.menu().element().style.overflowY = 'auto';
            }} onPopover={visible => {
                if (visible) {
                    dropdownRef.menu().element().style.width
                        = dropdownRef.element().getBoundingClientRect().width + 'px';
                }
                return false;
            }}>
                <TextField autocomplete='off' placeholder={l.t('_c.search')} accessor={searchFA}
                    prefix={<IconSearch class={styles['search-icon']} />}
                    suffix={
                        <Show when={searchFA.getValue()}>
                            <IconClear onclick={() => searchFA.setValue('')} class={styles['search-clear']} />
                        </Show>
                    }
                />
            </Dropdown>
        </Appbar>
        {props.children}
    </div>;
}

const routes: Array<RouteDefinition> = [
    { path: '/', component: lazy(() => import('./home')) },
    { path: themeRoute, component: lazy(() => import('./theme/builder')) },
    buildDemoRoute(demoRoute),
    buildDocsRoute(docsRoute),
];

run((props: RouteSectionProps) => <InternalApp {...props} />, routes, document.getElementById('app')!, options);
