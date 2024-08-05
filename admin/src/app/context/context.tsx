// SPDX-FileCopyrightText: 2024 caixw
//
// SPDX-License-Identifier: MIT

import * as i18n from '@solid-primitives/i18n';
import { JSX, createContext, createResource, createSignal, useContext } from 'solid-js';

import { build as buildOptions } from '@/app/options';
import { NotifySender, NotifyType } from '@/components';
import { Fetcher } from '@/core';
import { Locale, Messages, loads, names } from '@/locales';

type Options = ReturnType<typeof buildOptions>;

export type Context = ReturnType<typeof buildContext>['ctx'];

export type AppContext = Exclude<Context, 'options' | 'setNotifySender'>;

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

    const [user] = createResource(async () => {
        const r = await f.get<User>(o.api.info);
        if (!r.ok) { // 获取用户信息的接口会自动调用，不输出到通知栏。
            console.error(r.body);
            return;
        }
        return r.body;
    });

    let notifySender: NotifySender;

    const ctx = {
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
        user() { return user(); },

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
        async notify(title: string, body?: string, type: NotifyType='error', timeout=5) {
            notifySender.send(title, body, this.locale, type, timeout);
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
