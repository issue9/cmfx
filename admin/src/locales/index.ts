// SPDX-FileCopyrightText: 2024 caixw
//
// SPDX-License-Identifier: MIT

import * as i18n from '@solid-primitives/i18n';

import type { Messages } from './en';

export type { Messages };

/**
 * 支持的语言 ID
 */
export const locales = ['en', 'cmn-Hans'] as const;

export type Locale = typeof locales[number];

/**
 * 支持语言的 ID 以对应的名称
 */
export const names: Array<[Locale, string]> = [
    ['en', 'english'],
    ['cmn-Hans', '简体中文']
] as const;

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
