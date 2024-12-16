// SPDX-FileCopyrightText: 2024 caixw
//
// SPDX-License-Identifier: MIT

import { useLocation, useNavigate, useParams } from '@solidjs/router';
import { JSX, createContext, createResource, createSignal, useContext } from 'solid-js';

import { NotifyType } from '@/components/notify';
import { API, Config, Locale, Method, Problem, Return, Theme, UnitStyle, notify } from '@/core';
import { Token } from '@/core/api/token';
import { AppOptions } from './options';
import { User } from './user';

type ReqOptions = Required<AppOptions>;

export type AppContext = ReturnType<typeof buildContext>['ctx'];

const appContext = createContext<AppContext>();

const optContext = createContext<ReqOptions>();

// 保存于 sessionStorage 中的表示当前登录用户的 id
const currentKey = 'current';

/**
 * 提供应用内的全局操作方法
 */
export function useApp(): AppContext {
    const ctx = useContext(appContext);
    if (!ctx) {
        throw '未找到正确的 appContext';
    }
    return ctx;
}

/**
 * 提供应用初始化时的选项
 */
export function useOptions(): ReqOptions {
    const ctx = useContext(optContext);
    if (!ctx) {
        throw '未找到正确的 optContext';
    }
    return ctx;
}

export function buildContext(opt: Required<AppOptions>, f: API) {
    const [user, userData] = createResource(async () => {
        if (!f.isLogin()) {
            return;
        }

        const r = await f.get<User>(opt.api.info);
        if (r.ok) {
            const u = r.body;
            if (u && !u.avatar) {
                u.avatar = opt.logo;
            }
            return u;
        }

        await window.notify(r.body!.title);
    });

    let uid = sessionStorage.getItem(currentKey) ?? '';

    Theme.init(new Config(uid), opt.theme.schemes[0], opt.theme.mode, opt.theme.contrast);
    const [bp, setBP] = createSignal(Theme.breakpoint);
    Theme.onBreakpoint((v)=>setBP(v));

    let localeID: string | undefined;
    let unitStyle: UnitStyle | undefined;
    const [locale, localeData] = createResource(() => {
        const conf = new Config(uid);
        Theme.switchConfig(conf);
        return new Locale(conf, localeID, unitStyle);
    });

    const nav = useNavigate();
    const loc = useLocation();
    const params = useParams();

    const ctx = {
        /**
         * 返回 {@link useParams} 的返回对象
         *
         * 在新项目中直接使用 {@link useParams} 会与当前框架的存在冲突。
         * 所有需要使用 {@link useParams} 的地方可直接使用此方法的返回对象。
         */
        params() { return params; },
        
        /**
         * 返回 {@link useLocation} 的返回对象
         *
         * 在新项目中直接使用 {@link useLocation} 会与当前框架的存在冲突。
         * 所有需要使用 {@link useLocation} 的地方可直接使用此方法的返回对象。
         */
        location() { return loc; },
        
        /**
         * 返回 {@link useNavigate} 的返回对象
         *
         * 在新项目中直接使用 {@link useNavigate} 会与当前框架的存在冲突。
         * 所有需要使用 {@link useNavigate} 的地方可直接使用此方法的返回对象。
         */
        navigate() { return nav; },

        /**
         * 是否已经登录
         */
        isLogin() { return f.isLogin(); },

        /**
         * 清除浏览器的所有缓存
         */
        async clearCache(): Promise<void> {
            // api
            await f.clearCache();

            // localStorage
            localStorage.clear();
            sessionStorage.clear();

            // IndexedDB
            const dbs = await indexedDB.databases();
            for(const db of dbs) {
                if (db.name) {
                    indexedDB.deleteDatabase(db.name);
                }
            }

            await f.logout();

            nav(opt.routes.public.home);
        },

        /**
         * API 接口操作接口
         */
        get api() {
            return {
                /**
                 * 缓存 GET path 指向的数据
                 *
                 * @param path 相对于 baseURL 的接口地址；
                 * @param deps 缓存的依赖接口，这些依赖项的非 GET 接口一旦被调用，将更新当前的缓存项；
                 */
                cache(path: string, ...deps: Array<string>) { f.cache(path, ...deps); },

                /**
                 * 取消 GET path 指向的缓存数据
                 */
                async uncache(path: string): Promise<void> { await f.uncache(path); },

                async delete<R = never, PE = never>(path: string, withToken = true) {
                    return await f.delete<R, PE>(path, withToken);
                },

                async put<R = never, PE = never>(path: string, body?: unknown, withToken = true) {
                    return await f.put<R, PE>(path, body, withToken);
                },

                async patch<R = never, PE = never>(path: string, body?: unknown, withToken = true) {
                    return await f.patch<R, PE>(path, body, withToken);
                },

                async post<R = never, PE = never>(path: string, body?: unknown, withToken = true) {
                    return await f.post<R, PE>(path, body, withToken);
                },

                async get<R = never, PE = never>(path: string, withToken = true) { return await f.get<R, PE>(path, withToken); },

                async upload<R = never, PE = never>(path: string, obj: FormData, withToken = true) {
                    return await f.upload<R, PE>(path, obj, withToken);
                },

                async request<R = never, PE = never>(path: string, method: Method, obj?: unknown, withToken = true) {
                    return await f.request<R, PE>(path, method, obj, withToken);
                },

                async fetchWithArgument<R = never, PE = never>(path: string, method: Method, token?: string, ct?: string, body?: BodyInit) {
                    return await f.withArgument<R, PE>(path, method, token, ct, body);
                },

                async fetch<R = never, PE = never>(path: string, req?: RequestInit) { return await f.fetch<R, PE>(path, req); },
            };
        },

        /**
         * 将 {@link Problem} 作为错误进行处理，用户可以自行处理部分常用的错误，剩余的交由此方法处理。
         *
         * @param p 如果该值空，则会抛出异常；
         */
        async outputProblem<P>(p?: Problem<P>): Promise<void> {
            if (!p) {
                throw '发生了一个未知的错误，请联系管理员！';
            }

            if ((p.status === 401) && (opt.routes.public.home !== loc.pathname)) {
                nav(opt.routes.public.home);
            } else {
                await this.notify(p.title, p.detail);
            }
        },

        /**
         * 设置登录状态并刷新 user
         * @param r 登录接口返回的数据
         * @returns true 表示登录成功，其它情况表示错误信息
         */
        async login(r: Return<Token,never>) {
            const ret = await f.login(r);
            if (ret === true) {
                await userData.refetch();
                uid = this.user()!.id!.toString();
                sessionStorage.setItem(currentKey, uid);
                await localeData.refetch();
            }
            return ret;
        },

        /**
         * 退出登录并刷新 user
         */
        async logout() {
            await f.logout();
            sessionStorage.removeItem(currentKey);
            await userData.refetch();
            await localeData.refetch();
        },

        /**
         * 返回当前登录的用户信息
         */
        user() { return user(); },

        /**
         * 从服务器更新数据
         */
        async refetchUser() { await userData.refetch(); },

        set title(v: string) {
            if (v) {
                v = v + opt.titleSeparator + opt.title;
            } else {
                v = opt.title;
            }

            document.title = v;
        },

        /**
        * 发送一条通知给用户
        *
        * NOTE: 在组件还未初始化完成时，可能会发送到控制台。
        *
        * @param title 标题；
        * @param body 具体内容，如果为空则只显示标题；
        * @param type 类型，仅对非系统通知的情况下有效；
        * @param timeout 如果大于 0，超过此秒数时将自动关闭提法；
        */
        async notify(title: string, body?: string, type: NotifyType = 'error', timeout = 5) {
            if (opt.system.notification && await notify(title, body, opt.logo, locale()!.locale.language, timeout)) {
                return;
            }
            await window.notify(title, body, type, timeout);
        },

        breakpoint() { return bp(); },

        /**
         * 获取本地化的接口对象
         */
        locale(): Locale { return locale()!; },

        /**
         * 切换本地化对象
         *
         * @param id 本地化 ID
         */
        switchLocale(id: string) {
            localeID = id;
            localeData.refetch();
        },

        switchUnitStyle(style: UnitStyle) {
            unitStyle = style;
            localeData.refetch();
        },
    };

    const Provider = (props: { children: JSX.Element }) => {
        return <optContext.Provider value={opt}>
            <appContext.Provider value={ctx}>{props.children}</appContext.Provider>
        </optContext.Provider>;
    };

    return { ctx, Provider };
}