// SPDX-FileCopyrightText: 2024 caixw
//
// SPDX-License-Identifier: MIT

import * as i18n from '@solid-primitives/i18n';
import { createResource, createSignal } from 'solid-js';

import { Locale, Messages } from '@/locales';
import { Locales } from '../options';

/**
 * 获取翻译对象 M 的所有字段名作为类型
 *
 * NOTE: 如果是嵌套对象，则会以 . 进行拼接。
 */
export type KeyOfMessage<M extends i18n.BaseDict> = keyof i18n.Flatten<M>;

const loads: Record<Locale, {():Promise<Messages>}> = {
    'en': async()=>{return (await import('@/locales/en')).default;},
    'cmn-Hans': async()=>{return (await import('@/locales/cmn-Hans')).default;},
} as const;

function buildLoadMessages(locales : Locales) {
    return async function (id: Locale) {
        const internal: Messages = await loads[id]();
        const userData = await locales.loader(id);
        return i18n.flatten({
            _internal: internal,
            ...userData
        });
    };
}

export function createI18n(locales: Locales) {
    const [getLocale, setLocale] = createSignal(locales.fallback);
    const [dict] = createResource(getLocale, buildLoadMessages(locales));
    const t = i18n.translator(dict);

    return { getLocale, setLocale, t };
}
