// SPDX-FileCopyrightText: 2024 caixw
//
// SPDX-License-Identifier: MIT

import { DictKeys } from '@/core';
import { Messages } from './en';

export type { Messages } from './en';

/**
 * 支持的语言 ID
 */
export const locales = ['en', 'zh-Hans'] as const;

export type LocaleID = typeof locales[number];

export type MessagesKey = DictKeys<Messages>;
