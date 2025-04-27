// SPDX-FileCopyrightText: 2024-2025 caixw
//
// SPDX-License-Identifier: MIT

import { Drawer, List } from '@cmfx/components';
import { HashRouter, Navigate, RouteSectionProps } from '@solidjs/router';
import { Accessor, createSignal, ErrorBoundary, JSX, Match, ParentProps, Switch } from 'solid-js';
import { render } from 'solid-js/web';

import { AppOptions, useAdmin, useOptions } from '@/context';
import { buildContext, OptContext } from '@/context/context';
import { buildOptions } from '@/context/options';
import * as errors from './errors';
import { buildItems, MenuVisibleProps, default as Toolbar } from './toolbar';

/**
 * 初始化整个项目
 *
 * @param elementID 挂载的元素 ID；
 * @param o 项目的初始化选项；
 */
export async function create(elementID: string, o: AppOptions): Promise<void> {
    const opt = buildOptions(o);
    const { Provider } = await buildContext(opt);
    render(() => (<App opt={opt} p={Provider} />), document.getElementById(elementID)!);
}

/**
 * 项目的根组件
 */
function App(props: {opt: OptContext, p: { (props: { children: JSX.Element; }): JSX.Element;}}): JSX.Element {
    const menuVisible = createSignal(true);
    const [selected, setSelected] = createSignal<string>('');

    const Root = (p: RouteSectionProps) => {
        return <props.p>
            <div class="app palette--surface">
                <Toolbar menuVisible={menuVisible} switch={setSelected} />
                <main class="app-main">{p.children}</main>
            </div>
        </props.p>;
    };

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

    return <HashRouter root={Root}>{/*@once*/routes}</HashRouter>;
}

type PrivateProps = ParentProps<MenuVisibleProps & {
    selected: Accessor<string>; // 获取当前侧边栏选中的菜单项
}>;

function Private(props: PrivateProps): JSX.Element {
    const ctx = useAdmin();
    const opt = useOptions();

    return <Switch>
        <Match when={!ctx.isLogin()}>
            <Navigate href={/*@once*/opt.routes.public.home} />
        </Match>
        <Match when={ctx.isLogin()}>
            <Drawer floating={opt.aside.floatingMinWidth} palette='tertiary' mainID='main-content'
                close={()=>props.menuVisible[1](false)} visible={props.menuVisible[0]()}
                main={
                    <ErrorBoundary fallback={err=>errors.Unknown(err)}>{props.children}</ErrorBoundary>
                }>
                <List anchor selected={props.selected()}>{buildItems(ctx.locale(), opt.aside.menus)}</List>
            </Drawer>
        </Match>
    </Switch>;
}