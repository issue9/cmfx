// SPDX-FileCopyrightText: 2024-2025 caixw
//
// SPDX-License-Identifier: MIT

import { DictKeys } from '@cmfx/core';

import messages from './en.lang';

/**
 * 框架内部的翻译对象
 */
export type Messages = typeof messages;

/**
 * 支持的语言 ID
 */
export const locales = ['en', 'zh-Hans'] as const;

export type LocaleID = typeof locales[number];

export type MessagesKey = DictKeys<Messages>;
