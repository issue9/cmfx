// SPDX-FileCopyrightText: 2024 caixw
//
// SPDX-License-Identifier: MIT

import { useNavigate } from '@solidjs/router';
import { JSX, createContext, createSignal, useContext } from 'solid-js';

import { build as buildOptions } from '@/app/options';
import { NotifyType } from '@/components/notify';
import { Account, Breakpoint, Breakpoints, Fetcher, Method, Problem, notify } from '@/core';
import { Locale, names } from '@/locales';
import { createI18n } from './locale';
import { createUser } from './user';

type Options = ReturnType<typeof buildOptions>;

export type Context = ReturnType<typeof buildContext>['ctx'];

export type AppContext = Exclude<Context, 'options' | 'setNotifySender' | 'login' | 'logout'>;

const context = createContext<Context>();

/**
 * 内部使用的全局方法
 */
export function useInternal() {
    const ctx = useContext(context);
    if (!ctx) {
        throw '未找到正确的 context';
    }
    return ctx;
}

/**
 * 提供应用内的全局操作方法
 */
export function useApp(): AppContext { return useInternal(); }

export function buildContext(o: Options, f: Fetcher) {
    const { getLocale, setLocale, t } = createI18n(o.locales);

    const [user, { refetch }] = createUser(f, o.api.info);

    const [bp, setBP] = createSignal<Breakpoint>('xs');
    const breakpoints = new Breakpoints();
    breakpoints.onChange((val) => { setBP(val); });

    const ctx = {
        isLogin() { return f.isLogin(); },

        async delete<R = never, PE = never>(path: string, withToken = true) {
            return f.delete<R, PE>(path, withToken);
        },

        async put<R = never, PE = never>(path: string, body?: unknown, withToken = true) {
            return f.put<R,PE>(path, body, withToken);
        },

        async patch<R = never, PE = never>(path: string, body?: unknown, withToken = true) {
            return f.patch<R, PE>(path, body, withToken);
        },

        async post<R = never, PE = never>(path: string, body?: unknown, withToken = true) {
            return f.post<R, PE>(path, body, withToken);
        },

        async get<R = never, PE = never>(path: string, withToken = true) { return f.get<R, PE>(path, withToken); },

        async upload<R = never, PE = never>(path: string, obj: FormData, withToken = true) {
            return f.upload<R, PE>(path, obj, withToken);
        },

        async request<R = never, PE = never>(path: string, method: Method, obj?: unknown, withToken = true) {
            return f.request<R, PE>(path, method, obj, withToken);
        },

        async fetchWithArgument<R = never, PE = never>(path: string, method: Method, token?: string, ct?: string, body?: BodyInit) {
            return f.withArgument<R, PE>(path, method, token, ct, body);
        },

        async fetch<R = never, PE = never>(path: string, req?: RequestInit) { return f.fetch<R, PE>(path, req); },

        /**
         * 将 {@link Problem} 作为错误进行处理，用户可以自行处理部分常用的错误，剩余的交由此方法处理。
         *
         * @param status 反回的状态码；
         * @param p 如果该值空，半会抛出异常。
         */
        async outputProblem<P>(status: number, p?: Problem<P>): Promise<void> {
            if (status === 401) {
                const nav = useNavigate();
                nav(o.routes.public.home);
                return;
            }

            if (!p) {
                throw '发生了一个未知的错误，请联系管理员！';
            }
            await this.notify(p.title,p.detail);
        },

        /**
         * 执行登录操作并刷新 user
         * @param account 账号密码信息
         * @returns true 表示登录成功，其它情况表示错误信息
         */
        async login(account: Account) {
            const ret = await f.login(account);
            if (ret === true) {
                refetch();
            }
            return ret;
        },

        /**
         * 退出登录并刷新 user
         */
        async logout() {
            await f.logout();
            refetch();
        },

        /**
         * 返回当前登录的用户信息
         */
        user() { return user(); },

        /**
         * 触发更新用户的事件
         */
        updateUser() { refetch(); },

        breakpoint() { return bp(); },

        get options() { return o; },

        set title(v: string) {
            if (v) {
                v = v + o.titleSeparator + o.title;
            } else {
                v = o.title;
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
            if (o.system.notification && await notify(title, body, o.logo, getLocale(), timeout)) {
                return;
            }
            await window.notify(title, body, type, timeout);
        },

        // 以下为本地化相关功能

        t,
        get locale() { return getLocale(); },
        set locale(v: Locale) {
            document.documentElement.lang = v;
            setLocale(v);
            f.locale = v;
        },

        /**
         * 返回支持的本地化列表
         */
        get locales() { return names; }
    };

    const Provider = (props: { children: JSX.Element }) => {
        return <context.Provider value={ctx}>{props.children}</context.Provider>;
    };

    return { ctx, Provider };
}
