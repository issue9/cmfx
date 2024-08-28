// SPDX-FileCopyrightText: 2024 caixw
//
// SPDX-License-Identifier: MIT

import * as i18n from '@solid-primitives/i18n';
import { createResource, createSignal } from 'solid-js';

import type { Messages } from './en';

export type { Messages };

/**
 * 支持的语言 ID
 */
export const locales = ['en', 'cmn-Hans'] as const;

/**
 * 支持语言的 ID 以对应的名称
 */
export const names: Array<[Locale, string]> = [
    ['en', 'english'],
    ['cmn-Hans', '简体中文']
] as const;

export type Locale = typeof locales[number];

/**
 * 翻译项组成的类型
 */
export type MessageKey = KeyOfMessage<Messages>;

/**
 * 获取翻译对象 M 的所有字段名作为类型
 *
 * NOTE: 如果是嵌套对象，则会以 . 进行拼接。
 */
export type KeyOfMessage<M extends i18n.BaseDict> = keyof i18n.Flatten<M>;

/**
 * 表示语言 ID 以对应加载方法的对象
 *
 * 字段名为语言 ID，值为加载相应语言的方法。
 */
export type LocaleMessages<T extends i18n.BaseDict> = Record<Locale, { (): Promise<T> }>;

const loads: LocaleMessages<Messages> = {
    'en': async () => { return (await import('@/locales/en')).default; },
    'cmn-Hans': async () => { return (await import('@/locales/cmn-Hans')).default; },
} as const;

function buildLoadMessages(loaders: LocaleMessages<i18n.BaseDict>) {
    return async function (id: Locale) {
        const internal = await loads[id]();
        const userData = await loaders[id]();
        return i18n.flatten({
            ...internal,
            ...userData
        });
    };
}

export function createI18n(fallback: Locale, loaders: LocaleMessages<i18n.BaseDict>) {
    const [getLocale, setLocale] = createSignal(fallback);
    const [dict] = createResource(getLocale, buildLoadMessages(loaders));
    const t = i18n.translator(dict, i18n.resolveTemplate);

    return { getLocale, setLocale, t };
}

/**
 * 翻译函数的类型
 */
export type T = ReturnType<typeof createI18n>['t'];
