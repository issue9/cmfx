// SPDX-FileCopyrightText: 2024 caixw
//
// SPDX-License-Identifier: MIT

import * as i18n from '@solid-primitives/i18n';
import { JSX, createContext, createResource, createSignal, createUniqueId, useContext } from 'solid-js';
import { createStore } from 'solid-js/store';

import { Color } from '@/components';
import { Fetcher, notify } from '@/core';
import { Locale, Messages, loads, names } from '@/locales';
import { build as buildOptions } from './options';

type Options = ReturnType<typeof buildOptions>;
export type Context = Awaited<ReturnType<typeof buildContext>>;
export type AppContext = Exclude<Context, 'options' | 'getNotify' | 'delNotify'>;

const context = createContext<Context>();

export type NotifyType = 'error' | 'warning' | 'success' | 'info';

export const notifyColors = new Map<NotifyType, Color>([
    ['error', 'error'],
    ['warning', 'tertiary'],
    ['success', 'primary'],
    ['info', 'secondary'],
]);

interface Notification {
    type: NotifyType;
    title?: string;
    body?: string;
    id: string;
    timeout?: number;
}

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

export interface User {
    id?: number;
    sex?: 'unknown' | 'male' | 'female';
    name?: string;
    nicknae?: string;
    language?: string;
    timezone?: string;
    theme?: string;
    avatar?: string;
}

export function buildContext(o: Options, f: Fetcher) {
    const [getLocale, setLocale] = createSignal<Locale>(o.locales.fallback);

    const loadMessages = async (id: Locale) => {
        const internal: Messages = await loads[id]();
        const userData = await o.locales.loader(id);
        return i18n.flatten({
            _internal: internal,
            ...userData
        });
    };
    const [dict] = createResource(getLocale, loadMessages);
    const t = i18n.translator(dict);

    const [getNotifications, setNotifications] = createStore<Array<Notification>>([]);

    const [user, setUser] = createSignal<User>({});
    f.get<User>(o.api.info).then((r)=>{
        if (!r.ok) {
            console.log(r.body);
            return;
        }

        setUser(r.body!);
    });

    return {
        fetcher() {return f;}, // TODO 去掉部分不用的方法

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
         * 返回当前登录的用户信息
         */
        user() { return user; },

        // notify

        getNotify() { return getNotifications; },

        delNotify(id: string) {
            setNotifications((prev) => {
                return [...prev.filter((n) => { return n.id !== id; })];
            });
        },

        /**
        * 发送一条通知给用户
        *
        * @param title 标题；
        * @param body 具体内容，如果为空则只显示标题；
        * @param type 类型，仅对非系统通知的情况下有效；
        * @param timeout 如果大于 0，超过此秒数时将自动关闭提法；
        */
        async notify(title: string, body: string, type?: NotifyType, timeout=5) {
            if (o.systemNotify && await notify(o.logo, title, body, getLocale(), timeout)) {
                return;
            }

            const id = createUniqueId();
            if (!type) { type = 'info'; }
            setNotifications((prev) => [...prev, { title, body, type, id, timeout }]);
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
         *
         * 字段名为 ID 值，字段值为对应的名称。
         */
        get locales() { return names; }
    };
}

export function Provider(props: { ctx: Context, children: JSX.Element }): JSX.Element {
    return <context.Provider value={props.ctx}>
        {props.children}
    </context.Provider>;
}
