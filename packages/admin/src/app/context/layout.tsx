// SPDX-FileCopyrightText: 2026 caixw
//
// SPDX-License-Identifier: MIT

import {
    Appbar, AppbarRef, Button, ContextNotFoundError, Drawer, DrawerRef, Dropdown, joinClass, Layout, Menu,
    MenuRef, Palette, useOptions as useComponentOptions, useLocale
} from '@cmfx/components';
import {
    createContext, createEffect, createMemo, createSignal, ErrorBoundary,
    For, JSX, Match, onCleanup, onMount, ParentProps, Signal, Switch, useContext
} from 'solid-js';

import { buildItems } from '@admin/app/options';
import { useAdmin } from './admin';
import { ErrorHandler } from './errors';
import { useOptions } from './options';
import styles from './style.module.css';

/**
 * 侧边栏和顶部工具栏的背景色
 */
const bgPalette: Palette = 'tertiary';

/**
 * 在 Storage 中保存的配置项名称
 */
const layoutKey = 'layout';
const floatKey = 'float';
const widthKey = 'width';

interface LayoutContext {
    /**
     * 提供修改布局方向的接口
     */
    layout(): Signal<Layout>;

    /**
     * 提供修改是否为浮动状态的接口
     */
    float(): Signal<boolean>;

    /**
     * 提供修改页面最大宽度的接口
     */
    width(): Signal<number>;
}

const layoutContext = createContext<LayoutContext>();

/**
 * 提供修改面板布局的接口
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
    const float = createSignal(config.get<boolean>(floatKey) ?? opt.float);
    const width = createSignal(config.get<number>(widthKey) ?? opt.width);

    createEffect(() => { // 监视 layout 变化，并写入配置对象。
        config.set(layoutKey, layout[0]());
        config.set(floatKey, float[0]());
        config.set(widthKey, width[0]());
    });

    const ctx = {
        layout() { return layout; },
        float() { return float; },
        width() { return width; }
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
    const layout = useLayout();

    let menuRef: MenuRef;
    const [drawerRef, setDrawerRef] = createSignal<DrawerRef>();

    onMount(() => {
        if (menuRef) { menuRef.scrollSelectedIntoView(); }
    });

    // 保证两个顶部工具栏高度相同
    let asideBar: AppbarRef;
    let toolbar: AppbarRef;
    onMount(() => {
        const ro = new ResizeObserver(entries => {
            asideBar.root().style.height = entries[0]!.borderBoxSize[0].blockSize.toString() + 'px';
        });
        ro.observe(toolbar.root());
        onCleanup(() => ro.disconnect());
    });

    const style = createMemo(() => {
        const w = layout.width();
        if (!w[0]() || w[0]() === window.screen.width) { return; }
        return {
            width: w[0]() + 'px',
            margin: '0 auto',
        } as JSX.CSSProperties;
    });

    return <Drawer class={joinClass(undefined, styles.app, styles.horizontal, layout.float()[0]() ? styles.float : undefined)}
        floating={opt.floatingMinWidth} ref={setDrawerRef} style={style()}
        asideClass={joinClass(bgPalette, styles.aside)} mainClass={joinClass('surface', styles.main)} main={
            <ErrorBoundary fallback={ErrorHandler}>
                <div class='contents'>
                    <Appbar ref={el => toolbar = el} class={styles.toolbar} palette={bgPalette} actions={
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
        <Appbar ref={el => asideBar = el} logo={opt.logo} title={opt.title} class={styles.toolbar} />
        <Menu class={styles.menu} ref={el => menuRef = el} layout='inline' items={buildItems(l, opt.menus)} />
    </Drawer>;
}

function Vertical(props: ParentProps): JSX.Element {
    const opt = useOptions();
    const l = useLocale();
    const layout = useLayout();

    let menuRef: MenuRef;
    const [drawerRef, setDrawerRef] = createSignal<DrawerRef>();

    onMount(() => {
        if (menuRef) { menuRef.scrollSelectedIntoView(); }
    });

    const style = createMemo(() => {
        const w = layout.width();
        if (!w[0]() || w[0]() === window.screen.width) { return; }
        return {
            width: w[0]() + 'px',
            margin: '0 auto',
        } as JSX.CSSProperties;
    });

    return <div class={joinClass('surface', styles.app, styles.vertical, layout.float()[0]() ? styles.float : undefined)} style={style()}>
        <Appbar logo={opt.logo} title={opt.title}
            class={styles.toolbar} palette={bgPalette} actions={
                <>
                    <For each={opt.toolbar}>{Item => <Item />}</For>
                    <UserMenu />
                </>
            }>
            {drawerRef()?.ToggleButton({ square: true })}
        </Appbar>

        <main class={styles.main}>
            <Drawer floating={opt.floatingMinWidth} ref={setDrawerRef}
                asideClass={joinClass(bgPalette, styles.aside)}
                mainClass={joinClass('surface')} main={
                    <ErrorBoundary fallback={ErrorHandler}>{props.children}</ErrorBoundary>
                }>
                <Menu ref={el => menuRef = el} layout='inline' items={buildItems(l, opt.menus)} />
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
