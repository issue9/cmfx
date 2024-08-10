// SPDX-FileCopyrightText: 2024 caixw
//
// SPDX-License-Identifier: MIT

import { JSX, createContext, createResource, useContext } from 'solid-js';

import { build as buildOptions } from '@/app/options';
import { NotifySender, NotifyType } from '@/components';
import { Account, Fetcher, Method } from '@/core';
import { Locale, names } from '@/locales';
import { createI18n } from './locale';

type Options = ReturnType<typeof buildOptions>;

export type Context = ReturnType<typeof buildContext>['ctx'];

export type AppContext = Exclude<Context, 'options' | 'setNotifySender' | 'login' | 'logout'>;

/**
 * 翻译函数的类型
 */
export type T = AppContext['t'];

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

/**
 * 用户的基本信息
 */
export interface User {
    id?: number;
    sex?: 'unknown' | 'male' | 'female';
    name?: string;
    nickname?: string;
    language?: string;
    timezone?: string;
    theme?: string;
    avatar?: string;
}

export function buildContext(o: Options, f: Fetcher) {
    const { getLocale, setLocale, t } = createI18n(o.locales);

    // TODO
    const [user, { refetch }] = createResource(async () => {
        const r = await f.get<User>(o.api.info);
        if (!r.ok) { // 获取用户信息的接口会自动调用，不输出到通知栏。
            console.error(r.body);
            return;
        }
        return r.body as User;
    });

    let notifySender: NotifySender;

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

        async get<R=never,PE=never>(path: string, withToken = true) {
            return f.get<R,PE>(path, withToken);
        },

        async upload<R = never, PE = never>(path: string, obj: FormData, withToken = true) {
            return f.upload<R, PE>(path, obj, withToken);
        },

        async request<R = never, PE = never>(path: string, method: Method, obj?: unknown, withToken = true) {
            return f.request<R, PE>(path, method, obj, withToken);
        },

        async fetchWithArgument<R = never, PE = never>(path: string, method: Method, token?: string, ct?: string, body?: BodyInit) {
            return f.withArgument<R, PE>(path, method, token, ct, body);
        },

        async fetch<R = never, PE = never>(path: string, req?: RequestInit) {
            return f.fetch<R, PE>(path, req);
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
         * 绑定全局的通知方法
         */
        setNotifySender(s: NotifySender) { notifySender = s; },

        /**
        * 发送一条通知给用户
        *
        * @param title 标题；
        * @param body 具体内容，如果为空则只显示标题；
        * @param type 类型，仅对非系统通知的情况下有效；
        * @param timeout 如果大于 0，超过此秒数时将自动关闭提法；
        */
        async notify(title: string, body?: string, type: NotifyType = 'error', timeout = 5) {
            await notifySender.send(title, body, this.locale, type, timeout);
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
        return <context.Provider value={ctx}>
            {props.children}
        </context.Provider>;
    };

    return { ctx, Provider };
}
