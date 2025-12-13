// SPDX-FileCopyrightText: 2024-2025 caixw
//
// SPDX-License-Identifier: MIT

import { Mode, notify, useComponents, useLocale } from '@cmfx/components';
import { API, DisplayStyle, Problem, REST, Return, Token } from '@cmfx/core';
import { useNavigate } from '@solidjs/router';
import { JSX, ParentProps, createContext, createResource, mergeProps, useContext } from 'solid-js';

import { build as buildOptions } from '@/options/options';
import { HTTPError } from './errors';
import { User } from './user';

type OptContext = ReturnType<typeof buildOptions>;

type InternalOptions = OptContext & {
    coreAPI: API;
    actions: ReturnType<typeof buildActions>;
};

const internalOptContext = createContext<InternalOptions>();

// 保存于 sessionStorage 中的表示当前登录用户的 id
const currentKey = '-uid';

/**
 * 获取全局的操作接口
 *
 * @returns 返回一个元组，包含以下属性：
 * - 0: {@link REST} 对象，相对于 {@link API}，会自动添加 `Accept-Language` 报头；
 * - 1: 组件库提供的其它方法；
 * - 2: 组件库初始化时的选项；
 */
export function useAdmin(): [api: REST, actions: ReturnType<typeof buildActions>, options: OptContext] {
    const ctx = useContext(internalOptContext);
    if (!ctx) { throw '未找到正确的 optContext'; }

    const l = useLocale();
    return [ctx.coreAPI.rest(new Headers({ 'Accept-Language': l.locale.toString() })), ctx.actions, ctx];
}

// NOTE: 需要保证在 {@link run} 之内运行
export function Provider(props: ParentProps<OptContext & {coreAPI: API}>): JSX.Element {
    const nav = useNavigate();
    const [act] = useComponents();
    const p = mergeProps(props, {
        coreAPI: props.coreAPI,
        actions: buildActions(props.coreAPI, act, props, nav),
    });

    const uid = parseInt(sessionStorage.getItem(props.id + currentKey) ?? '0');
    p.actions.switchConfig(uid);

    return <internalOptContext.Provider value={p}>
        {props.children}
    </internalOptContext.Provider>;
}

export async function clearStorage(api: API) {
    await api.logout();

    await api.clearCache();

    // localStorage
    localStorage.clear();
    sessionStorage.clear();

    // IndexedDB
    const dbs = await indexedDB.databases();
    for (const db of dbs) {
        if (db.name) { indexedDB.deleteDatabase(db.name); }
    }
}

function buildActions(
    api: API, act: ReturnType<typeof useComponents>[0], opt: OptContext, nav: ReturnType<typeof useNavigate>
) {
    const [user, userData] = createResource(async (): Promise<User | undefined> => {
        // 虽然返回的值没有用，但不能是 undefined，否则会出错。
        if (!api.isLogin()) { return; }

        // 依然可能 401，比如由服务器导致的用户退出，api.isLogin 是检测不出来的。

        const r = await api.get<User>(opt.api.info);
        if (r.ok) {
            const u = r.body;
            if (u && !u.avatar) { u.avatar = opt.logo; }
            return u;
        }

        throw new HTTPError(r.status, r.body?.title!, r.body?.detail); // 此时 notify 还未初始化
    });

    return {
        /**
         * 是否已经登录
         */
        isLogin(): boolean {
            // NOTE: api.isLogin 不是响应式的，所以改为 user。
            return !user.loading && !!user();
        },

        /**
         * 清除浏览器的所有缓存
         */
        async clearCache(): Promise<void> {
            await clearStorage(api);
            nav(opt.routes.public.home);
        },

        /**
         * 将 {@link Problem} 作为错误进行处理，用户可以自行处理部分常用的错误，剩余的交由此方法处理。
         *
         * @param p - 如果该值空，则会抛出异常；
         */
        async handleProblem<P>(p?: Problem<P>): Promise<void> {
            if (!p) { throw '发生了一个未知的错误，请联系管理员！'; }

            if (p.status === API.ErrorCode || p.status >= 500) {
                throw new HTTPError(p.status, p.title, p.detail);
            } else { // 其它 4XX 错误弹出提示框
                await notify(p.title, p.detail, 'error');
            }
        },

        /**
         * 设置登录状态并刷新 user
         *
         * 相较于 {@link API#login} 此方法除了登录，还执行一些额外的操作。
         *
         * @param r - 登录接口返回的数据
         * @returns true 表示登录成功，其它情况表示错误信息
         */
        async login(r: Return<Token, never>) {
            const ret = await api.login(r);
            if (ret === true) {
                await userData.refetch();
                const uid = this.user()!.id!.toString();
                sessionStorage.setItem(opt.id + currentKey, uid);
                act.switchConfig(uid);
            }
            return ret;
        },

        /**
         * 退出登录并刷新 user
         *
         * 相较于 {@link API#logout} 此方法除了登录，还执行一些额外的操作。
         *
         */
        async logout() {
            await api.logout();
            sessionStorage.removeItem(opt.id + currentKey);
            userData.mutate();
            act.switchConfig(opt.configName);
        },

        /**
         * 返回当前登录的用户信息
         */
        user() { return user(); },

        /**
         * 从服务器更新数据
         */
        async refetchUser() { await userData.refetch(); },

        setTitle(v: string) { act.setTitle(v); },

        switchConfig(id: string | number): void { act.switchConfig(id); },

        /**
         * 切换主题色
         */
        switchScheme(scheme: string) { act.switchScheme(scheme); },

        /**
         * 切换主题模式
         */
        switchMode(mode: Mode) { act.switchMode(mode); },

        /**
         * 切换本地化对象
         *
         * @param id - 本地化 ID
         */
        switchLocale(id: string) { act.switchLocale(id); },

        switchDisplayStyle(style: DisplayStyle) { act.switchDisplayStyle(style); },
    };
}
