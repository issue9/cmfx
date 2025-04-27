// SPDX-FileCopyrightText: 2024-2025 caixw
//
// SPDX-License-Identifier: MIT

import { NotifyType, init } from '@cmfx/components';
import { API, Config, Problem, Return, Token, UnitStyle } from '@cmfx/core';
import { useLocation, useNavigate } from '@solidjs/router';
import { JSX, createContext, createResource, useContext } from 'solid-js';

import { buildOptions } from './options';
import { User } from './user';

export type OptContext = ReturnType<typeof buildOptions>;

export type AppContext = Awaited<ReturnType<typeof buildContext>>['ctx'];

const appContext = createContext<AppContext>();

const optContext = createContext<OptContext>();

// 保存于 sessionStorage 中的表示当前登录用户的 id
const currentKey = 'current';

/**
 * 提供应用内的全局操作方法
 */
export function useAdmin(): AppContext {
    const ctx = useContext(appContext);
    if (!ctx) {
        throw '未找到正确的 appContext';
    }
    return ctx;
}

/**
 * 提供应用初始化时的选项
 */
export function useOptions(): OptContext {
    const ctx = useContext(optContext);
    if (!ctx) {
        throw '未找到正确的 optContext';
    }
    return ctx;
}

export async function buildContext(opt: OptContext) {
    let uid = sessionStorage.getItem(opt.id+currentKey) ?? '';
    const conf = new Config(opt.id, uid, opt.storage);
    const oa = opt.api;

    const api = await API.build(conf, oa.base, oa.token, oa.contentType, oa.acceptType, opt.locales.fallback);
    await api.clearCache(); // 刷新或是重新打开之后，清除之前的缓存。
    api.cache(opt.api.info);

    const lp = await init({
        config: conf,
        api: api,
        
        locale: opt.locales.fallback,
        messages: opt.locales.messages,

        scheme: opt.theme?.schemes[0], // TODO
        title: opt.title,
        titleSeparator: opt.titleSeparator,
        pageSizes: opt.api.pageSizes,
        pageSize: opt.api.presetSize,
        logo:opt.logo,
        systemDialog: opt.system.dialog,
        systemNotify: opt.system.notification,
        outputProblem: async function <P>(p?: Problem<P>): Promise<void> {
            if (!p) {
                throw '发生了一个未知的错误，请联系管理员！';
            }

            const loc = useLocation();
            const nav = useNavigate();
            if ((p.status === 401) && (opt.routes.public.home !== loc.pathname)) {
                nav(opt.routes.public.home);
            } else {
                await lp.context.notify(p.title, p.detail);
            }
        }
    }); 

    const [user, userData] = createResource(async () => {
        if (!api.isLogin()) {
            return;
        }

        // 依然可能 401，比如由服务器导致的用户退出，f.isLogin 是检测不出来的。

        const r = await api.get<User>(opt.api.info);
        if (r.ok) {
            const u = r.body;
            if (u && !u.avatar) {
                u.avatar = opt.logo;
            }
            return u;
        }

        // 此时 notify 还未初始化
        console.error(r.body?.title);
    });

    const ctx = {
        /**
         * 是否已经登录
         */
        isLogin() { return api.isLogin(); },

        /**
         * 清除浏览器的所有缓存
         */
        async clearCache(): Promise<void> {
            await api.clearCache();

            // localStorage
            localStorage.clear();
            sessionStorage.clear();

            // IndexedDB
            const dbs = await indexedDB.databases();
            for (const db of dbs) {
                if (db.name) {
                    indexedDB.deleteDatabase(db.name);
                }
            }

            await api.logout();

            useNavigate()(opt.routes.public.home);
        },

        /**
         * API 接口操作接口
         */
        get api() { return api; },

        /**
         * 将 {@link Problem} 作为错误进行处理，用户可以自行处理部分常用的错误，剩余的交由此方法处理。
         *
         * @param p 如果该值空，则会抛出异常；
         */
        async outputProblem<P>(p?: Problem<P>): Promise<void> { await lp.context.outputProblem(p); },

        /**
         * 设置登录状态并刷新 user
         * @param r 登录接口返回的数据
         * @returns true 表示登录成功，其它情况表示错误信息
         */
        async login(r: Return<Token, never>) {
            const ret = await api.login(r);
            if (ret === true) {
                await userData.refetch();
                uid = this.user()!.id!.toString();
                sessionStorage.setItem(opt.id+currentKey, uid);
                lp.context.switchConfig(uid);
            }
            return ret;
        },

        /**
         * 退出登录并刷新 user
         */
        async logout() {
            await api.logout();
            sessionStorage.removeItem(opt.id+currentKey);
            await userData.refetch();
            // lp.context.switchConfig(uid); // 退出登录时，不切换配置项。
        },

        /**
         * 返回当前登录的用户信息
         */
        user() { return user(); },

        /**
         * 从服务器更新数据
         */
        async refetchUser() { await userData.refetch(); },

        set title(v: string) { lp.context.title = v; },

        /**
         * 发送一条通知给用户
         */
        async notify(title: string, body?: string, type: NotifyType = 'error', timeout = 5000) {
            await lp.context.notify(title, body, type, timeout);
        },

        /**
         * 获取本地化的接口对象
         */
        locale() { return lp.context.locale()!; },

        switchConfig(id: string | number): void { lp.context.switchConfig(id); },

        /**
         * 切换本地化对象
         *
         * @param id 本地化 ID
         */
        switchLocale(id: string) { lp.context.switchLocale(id); },

        switchUnitStyle(style: UnitStyle) { lp.context.switchUnitStyle(style); },
    };

    const Provider = (props: { children: JSX.Element }): JSX.Element => {
        return <optContext.Provider value={opt}>
            <appContext.Provider value={ctx}>
                <lp.Provider>
                    {props.children}
                </lp.Provider>
            </appContext.Provider>
        </optContext.Provider>;
    };

    return { ctx, Provider };
}
