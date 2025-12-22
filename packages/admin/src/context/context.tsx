// SPDX-FileCopyrightText: 2024-2025 caixw
//
// SPDX-License-Identifier: MIT

import { notify, OptionsSetter, useLocale, useOptions } from '@cmfx/components';
import { API, Problem, REST, Return, Token } from '@cmfx/core';
import { createContext, createResource, JSX, mergeProps, ParentProps, useContext } from 'solid-js';

import { build as buildOptions } from '@/options/options';
import { HTTPError } from './errors';
import { User } from './user';

type OptionsContext = ReturnType<typeof buildOptions>;

type AdminContext = OptionsContext & {
    coreAPI: API;
    actions: ReturnType<typeof buildActions>;
};

const adminContext = createContext<AdminContext>();

/**
 * 获取全局的操作接口
 *
 * @returns 返回一个元组，包含以下属性：
 * - 0: {@link REST} 对象，相对于 {@link API}，会自动添加 `Accept-Language` 报头；
 * - 1: 组件库提供的其它方法；
 * - 2: 组件库初始化时的选项；
 */
export function useAdmin(): [rest: REST, actions: ReturnType<typeof buildActions>, options: OptionsContext] {
    const ctx = useContext(adminContext);
    if (!ctx) { throw '未找到正确的 adminContext'; }

    const l = useLocale();
    return [ctx.coreAPI.rest(new Headers({ 'Accept-Language': l.locale.toString() })), ctx.actions, ctx];
}

// NOTE: 需要保证在 {@link run} 之内运行
export function Provider(props: ParentProps<OptionsContext & {coreAPI: API}>): JSX.Element {
    const [act] = useOptions();
    const p = mergeProps(props, {
        coreAPI: props.coreAPI,
        actions: buildActions(props.coreAPI, act, props),
    });

    return <adminContext.Provider value={p}>{props.children}</adminContext.Provider>;
}

function buildActions(api: API, set: OptionsSetter, opt: OptionsContext) {
    const l = useLocale();

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

        const title = r.body ? r.body.title : l.t('_p.app.fetchUserInfoError');
        notify(title, undefined, 'error', l.locale.toString());
    });

    return {
        /**
         * 是否已经登录
         */
        isLogin(): boolean {
            // NOTE: API.isLogin 不是响应式的，所以改为 user。
            return !user.loading && !!user();
        },

        /**
         * 清除浏览器的所有缓存
         *
         * @param type - 缓存类型，可以是以下值：
         * - `cache`：清除与后通讯中接口保存的缓存；
         * - `storage`：清除存储在 storage 中的登录信息和当前用户的配置信息；
         * - `undefined`：同时包含以上两者；
         */
        async clearCache(type?: 'cache' | 'storage'): Promise<void> {
            switch (type) {
            case 'cache':
                await api.clearCache();
                break;
            case 'storage':
                await this.logout(); // 清除存储在 storage 中的登录信息
                set.clearStorage();
                break;
            default:
                await api.clearCache();
                await this.logout();
                set.clearStorage();
            }
        },

        /**
         * 将 {@link Problem} 作为错误进行处理，用户可以自行处理部分常用的错误，剩余的交由此方法处理。
         *
         * @param p - 如果该值空，则会抛出异常；
         */
        async handleProblem<P>(p?: Problem<P>): Promise<void> {
            if (!p) { throw new Error('发生了一个未知的错误，请联系管理员！'); }

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
                set.switchConfig(uid);
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
            userData.mutate();
            set.switchConfig(opt.configName);
        },

        /**
         * 返回当前登录的用户信息
         */
        user() { return user(); },

        /**
         * 从服务器更新数据
         */
        async refetchUser() { await userData.refetch(); },
    };
}
