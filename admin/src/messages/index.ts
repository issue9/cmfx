// SPDX-FileCopyrightText: 2024 caixw
//
// SPDX-License-Identifier: MIT

import { match } from '@formatjs/intl-localematcher';
import * as i18n from '@solid-primitives/i18n';
import { createResource, createSignal } from 'solid-js';

import type { Messages } from './en';

export type { Messages };

/**
 * 支持的语言 ID
 */
export const locales = ['en', 'cmn-Hans'] as const;

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
export type MessagesLoader<T extends i18n.BaseDict> = Record<Locale, { (): Promise<T> }>;

const internalLoaders: MessagesLoader<Messages> = {
    'en': async () => { return (await import('@/messages/en')).default; },
    'cmn-Hans': async () => { return (await import('@/messages/cmn-Hans')).default; },
} as const;

function buildLoader(fallback: Locale, userLoaders: MessagesLoader<i18n.BaseDict>) {
    return async function (id: string) {
        const l = match([id], locales, fallback) as Locale; // 查找与 id 最匹配的本地化消息加载
        const internal = await internalLoaders[l]();
        const userData = await userLoaders[l]();
        return i18n.flatten({
            ...internal,
            ...userData
        });
    };
}

export function create(fallback: Locale, userLoaders: MessagesLoader<i18n.BaseDict>) {
    const [get, set] = createSignal<string>();
    const [dict] = createResource(get, buildLoader(fallback, userLoaders));
    const t = i18n.translator(dict, i18n.resolveTemplate);

    return { reload: set, t };
}

/**
 * 翻译函数的类型
 */
export type T = ReturnType<typeof create>['t'];
