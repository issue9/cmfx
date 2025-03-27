// SPDX-FileCopyrightText: 2024-2025 caixw
//
// SPDX-License-Identifier: MIT

import { DictKeys } from '@/core';
import { Messages } from './en.lang';

export type { Messages } from './en.lang';

/**
 * 支持的语言 ID
 */
export const locales = ['en', 'zh-Hans'] as const;

export type LocaleID = typeof locales[number];

export type MessagesKey = DictKeys<Messages>;
