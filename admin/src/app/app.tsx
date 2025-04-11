// SPDX-FileCopyrightText: 2024-2025 caixw
//
// SPDX-License-Identifier: MIT

import { HashRouter, Navigate, RouteSectionProps } from '@solidjs/router';
import { Accessor, createSignal, ErrorBoundary, JSX, Match, ParentProps, Switch } from 'solid-js';
import { render } from 'solid-js/web';

import { Drawer, List, Notify, registerChartLocales, SystemDialog, AppOptions, useApp, useOptions } from '@/components';
import { buildOptions } from '@/components/context/options';
import { buildContext, OptContext } from '@/components/context/context';
import { API, Hotkey, Locale } from '@/core';
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
    const ao = opt.api;

    const api = await API.build(o.id, ao.base, ao.login, ao.encoding.content, ao.encoding.accept, opt.locales.fallback);
    await api.clearCache(); // 刷新或是重新打开之后，清除之前的缓存。
    api.cache(opt.api.info);

    // 加载本地化语言
    Locale.init(opt.locales.fallback, api);
    for(const item of Object.entries(opt.locales.messages)) {
        await Locale.addDict(item[0], ...item[1]);
        registerChartLocales(item[0]); // 加载图表组件的本地化语言
    }

    Hotkey.init(); // 初始化快捷键。

    render(() => (<App opt={opt} api={api} />), document.getElementById(elementID)!);
}

/**
 * 项目的根组件
 */
function App(props: {opt: OptContext, api: API}): JSX.Element {
    const menuVisible = createSignal(true);
    const [selected, setSelected] = createSignal<string>('');

    const Root = (p: RouteSectionProps) => {
        // buildContext 中使用了 useNavigate 和 useLocation，必须得 Router 之内使用。
        const { Provider } = buildContext(props.opt, props.api);

        return <Provider>
            <Notify />
            <SystemDialog palette='surface' />

            <div class="app palette--surface">
                <Toolbar menuVisible={menuVisible} switch={setSelected} />
                <main class="app-main">{p.children}</main>
            </div>
        </Provider>;
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
    /*
     *获取当前侧边栏选中的菜单项
     */
    selected: Accessor<string>;
}>;

function Private(props: PrivateProps): JSX.Element {
    const ctx = useApp();
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