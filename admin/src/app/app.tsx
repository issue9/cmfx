// SPDX-FileCopyrightText: 2024 caixw
//
// SPDX-License-Identifier: MIT

import { HashRouter } from '@solidjs/router';
import { JSX, Show, createSignal } from 'solid-js';
import { render } from 'solid-js/web';

import { Notify, SystemDialog } from '@/components';
import { API, Locale } from '@/core';
import { buildContext } from './context';
import * as errors from './errors';
import { Options, build as buildOptions } from './options';
import { Private } from './private';
import { default as Toolbar } from './toolbar';

/**
 * 初始化整个项目
 *
 * @param elementID 挂载的元素 ID，用户需要在该元素上指定高和宽，
 *  如果要占满页面可以用 100dvh 和 100dvw 或是预定义的类 view-full；
 * @param o 项目的初始化选项；
 */
export async function create(elementID: string, o: Options) {
    const opt = buildOptions(o);
    const api = await API.build(opt.api.base, opt.api.login, opt.mimetype, opt.locales.fallback);

    Locale.init(opt.locales.fallback, api);
    for(const item of Object.entries(opt.locales.messages)) {
        await Locale.addDict(item[0], ...item[1]);
    }

    render(() => (<App opt={opt} api={api} />), document.getElementById(elementID)!);
}

/**
 * 项目的根组件
 */
function App(props: {opt: Required<Options>, api: API}) {
    const [menuVisible, setMenuVisible] = createSignal(true);

    const Root = (p: { children?: JSX.Element }) => {
        // buildContext 中使用了 useContext 和 useNavigate，必须得 Router 之内使用。
        const { Provider } = buildContext(props.opt, props.api);

        return <Provider>
            <Notify />
            <Show when={props.opt.system.dialog}>
                <SystemDialog palette='surface' />
            </Show>
            <div class="app palette--surface">
                <Toolbar menuVisibleGetter={menuVisible} menuVisibleSetter={setMenuVisible} />
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
                <Private menuVisibleGetter={menuVisible} menuVisibleSetter={setMenuVisible}>{ props.children }</Private>,

            // 所有的 404 都将会在 children 中匹配 *，如果是未登录，则在匹配之后跳转到登录页。
            children: [...props.opt.routes.private.routes, { path: '*', component: errors.NotFound }]
        }
    ];

    return <HashRouter root={Root}>{/*@once*/routes}</HashRouter>;
}
