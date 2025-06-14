// SPDX-FileCopyrightText: 2024-2025 caixw
//
// SPDX-License-Identifier: MIT

import { Drawer, joinClass, List } from '@cmfx/components';
import { HashRouter, Navigate, RouteSectionProps } from '@solidjs/router';
import { Accessor, createSignal, ErrorBoundary, JSX, Match, ParentProps, Switch } from 'solid-js';
import { render } from 'solid-js/web';

import { use, useLocale } from '@/context';
import { Provider } from '@/context/context';
import { build as buildOptions, Options } from '@/options/options';
import * as errors from './errors';
import styles from './style.module.css';
import { buildItems, MenuVisibleProps, default as Toolbar } from './toolbar';

/**
 * 初始化整个项目
 *
 * @param elementID 挂载的元素 ID；
 * @param o 项目的初始化选项；
 */
export function create(elementID: string, o: Options) {
    render(() => (<App opt={buildOptions(o)} />), document.getElementById(elementID)!);
}

/**
 * 项目的根组件
 */
function App(props: { opt: ReturnType<typeof buildOptions> }): JSX.Element {
    const menuVisible = createSignal(true);
    const [selected, setSelected] = createSignal<string>('');

    const routes = [
        {
            path: '/',
            component: (props: { children?: JSX.Element }) => <>{props.children}</>,
            children: props.opt.routes.public.routes
        },
        {
            path: '/',
            component: (props: { children?: JSX.Element })=>
                <Private menuVisible={menuVisible} selected={selected}>{ props.children }</Private>,

            // 所有的 404 都将会在 children 中匹配 *，如果是未登录，则在匹配之后跳转到登录页。
            children: [...props.opt.routes.private.routes, { path: '*', component: errors.NotFound }]
        }
    ];

    const root = (p: RouteSectionProps) => {
        return <Provider {...props.opt}>
            <div class={ joinClass(styles.app, 'palette-surface') }>
                <Toolbar menuVisible={menuVisible} switch={setSelected} />
                <main class={styles.main}>{p.children}</main>
            </div>
        </Provider>;
    };

    return <HashRouter root={root}>{/*@once*/routes}</HashRouter>;
}

type PrivateProps = ParentProps<MenuVisibleProps & {
    selected: Accessor<string>; // 获取当前侧边栏选中的菜单项
}>;

function Private(props: PrivateProps): JSX.Element {
    const l = useLocale();
    const [api, act, opt] = use();

    return <Switch>
        <Match when={!api.isLogin()}>
            <Navigate href={/*@once*/opt.routes.public.home} />
        </Match>
        <Match when={act.isLogin()}>
            <Drawer floating={opt.aside.floatingMinWidth} palette='tertiary'
                close={()=>props.menuVisible[1](false)} visible={props.menuVisible[0]()}
                main={
                    <ErrorBoundary fallback={err=>errors.Unknown(err)}>{props.children}</ErrorBoundary>
                }>
                <List anchor selected={props.selected()}>{buildItems(l, opt.aside.menus)}</List>
            </Drawer>
        </Match>
    </Switch>;
}