// SPDX-FileCopyrightText: 2024 caixw
//
// SPDX-License-Identifier: MIT

import * as i18n from '@solid-primitives/i18n';
import { createContext, createResource, createSignal } from 'solid-js';

import { buildFetch } from '@/core';
import { Locale, Messages, loads, names } from '@/locales';
import { build as buildOptions } from './options';

type Options = Awaited<ReturnType<typeof buildOptions>>;

export type Context = Awaited<ReturnType<typeof buildContext>>;

export const context = createContext<Context>();

export function buildContext(o: Options, f: Awaited<ReturnType<typeof buildFetch>>) {
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

    return {
        ...f, // TODO 需要改进接口实现

        isLogin(): boolean {
            let is = false;
            f.isLogin().then((v)=>{
                is=v;
            }).catch(()=>{
                is=false;
            });
            return is;
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
