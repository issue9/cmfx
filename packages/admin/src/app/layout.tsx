// SPDX-FileCopyrightText: 2026 caixw
//
// SPDX-License-Identifier: MIT

import { Appbar, Drawer, DrawerRef, joinClass, Menu, MenuRef, Palette, useLocale } from '@cmfx/components';
import { createSignal, ErrorBoundary, JSX, Match, onMount, ParentProps, Switch } from 'solid-js';

import { useOptions } from './context';
import { ErrorHandler } from './errors';
import { buildItems } from './options';
import styles from './style.module.css';
import { default as Toolbar } from './toolbar';

const bgPalette: Palette = 'tertiary';

export function AppLayout(props: ParentProps): JSX.Element {
    const opt = useOptions();

    return <Switch fallback={<Horizontal {...props} />}>
        <Match when={opt.layout === 'vertical'}>
            <Vertical {...props} />
        </Match>
    </Switch>;
}

function Horizontal(props: ParentProps): JSX.Element {
    const opt = useOptions();
    const l = useLocale();

    let menuRef: MenuRef;
    const [drawerRef, setDrawerRef] = createSignal<DrawerRef>();

    onMount(() => {
        if (menuRef) { menuRef.scrollSelectedIntoView(); }
    });

    return <Drawer class={joinClass(undefined, styles.app, styles.horizontal)}
        floating={opt.floatingMinWidth} palette={bgPalette} ref={setDrawerRef}
        mainClass={joinClass('surface', styles.main)} main={
            <ErrorBoundary fallback={ErrorHandler}>
                <div class='contents'>
                    <Toolbar palette={bgPalette} drawer={drawerRef} />
                    <main class={styles.content}>{props.children}</main>
                </div>
            </ErrorBoundary>
        }
    >
        <div class={styles.aside}>
            <Appbar logo={opt.logo} title={opt.title} />
            <Menu class={styles.menu} ref={el => menuRef = el} layout='inline' items={buildItems(l, opt.menus)} />
        </div>
    </Drawer>;
}

function Vertical(props: ParentProps): JSX.Element {
    const opt = useOptions();
    const l = useLocale();

    let menuRef: MenuRef;
    const [drawerRef, setDrawerRef] = createSignal<DrawerRef>();

    onMount(() => {
        if (menuRef) { menuRef.scrollSelectedIntoView(); }
    });

    return <div class={joinClass('surface', styles.app, styles.vertical)}>
        <Toolbar drawer={drawerRef} palette={bgPalette} showTitle />
        <main class={styles.main}>
            <Drawer floating={opt.floatingMinWidth} palette={bgPalette} ref={setDrawerRef}
                mainClass={joinClass('surface')} main={
                    <ErrorBoundary fallback={ErrorHandler}>{props.children}</ErrorBoundary>
                }>
                <Menu ref={el => menuRef = el} class={styles.aside} layout='inline' items={buildItems(l, opt.menus)} />
            </Drawer>
        </main>
    </div>;
}
