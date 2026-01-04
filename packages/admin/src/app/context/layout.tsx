// SPDX-FileCopyrightText: 2026 caixw
//
// SPDX-License-Identifier: MIT

import {
    Appbar, Button, ContextNotFoundError, Drawer, DrawerRef, Dropdown, joinClass, Layout, Menu,
    MenuRef, Palette, useOptions as useComponentOptions, useLocale
} from '@cmfx/components';
import {
    createContext, createEffect, createSignal, ErrorBoundary,
    For, JSX, Match, onMount, ParentProps, Signal, Switch, useContext
} from 'solid-js';

import { buildItems } from '@/app/options';
import { useAdmin } from './admin';
import { ErrorHandler } from './errors';
import { useOptions } from './options';
import styles from './style.module.css';

const bgPalette: Palette = 'tertiary';

/**
 * 在 Storage 中保存的配置项名称
 */
const layoutKey = 'layout';

interface LayoutContext {
    /**
     * 提供修改布局方向的接口
     */
    layout(): Signal<Layout>;
}

const layoutContext = createContext<LayoutContext>();

/**
 * 提供修改布局方向的接口
 */
export function useLayout(): LayoutContext {
    const l = useContext(layoutContext);
    if (!l) { throw new ContextNotFoundError('layoutContext'); }

    return l;
}

export function AppLayout(props: ParentProps): JSX.Element {
    const [,co] = useComponentOptions();
    const config = co.config;

    const opt = useOptions();
    const layout = createSignal(config.get<Layout>(layoutKey) ?? opt.layout);

    createEffect(() => { // 监视 layout 变化，并写入配置对象。
        config.set(layoutKey, layout[0]());
    });

    const ctx = {
        layout() { return layout; },
    };

    return <layoutContext.Provider value={ctx}>
        <Switch fallback={<Horizontal {...props} />}>
            <Match when={layout[0]() === 'vertical'}>
                <Vertical {...props} />
            </Match>
        </Switch>
    </layoutContext.Provider>;
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
                    <Appbar class='px-4' palette={bgPalette} actions={
                        <>
                            <For each={opt.toolbar}>{Item => <Item />}</For>
                            <UserMenu />
                        </>
                    }>
                        {drawerRef()?.ToggleButton({ square: true })}
                    </Appbar>
                    <main class={styles.content}>{props.children}</main>
                </div>
            </ErrorBoundary>
        }
    >
        <div class={styles.aside}>
            <Appbar logo={opt.logo} title={opt.title} class="px-4" />
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
        <Appbar logo={opt.logo} title={opt.title}
            class='px-4' palette={bgPalette} actions={
                <>
                    <For each={opt.toolbar}>{Item => <Item />}</For>
                    <UserMenu />
                </>
            }>
            {drawerRef()?.ToggleButton({ square: true })}
        </Appbar>

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

/**
 * 用户名及其下拉菜单
 */
function UserMenu(): JSX.Element {
    const opt = useOptions();
    const usr = useAdmin();
    const l = useLocale();

    return <Dropdown trigger='hover' items={buildItems(l, opt.userMenus)}>
        <Button kind='flat' class="ps-1">
            <img alt='avatar' class={styles.avatar} src={usr.info()?.avatar} />
            {usr.info()?.name}
        </Button>
    </Dropdown>;
}
