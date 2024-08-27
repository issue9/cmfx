// SPDX-FileCopyrightText: 2024 caixw
//
// SPDX-License-Identifier: MIT

export type { Messages } from './en';

export const locales = ['en', 'cmn-Hans'] as const;

export type Locale = typeof locales[number];

export const names: Array<[Locale, string]> = [
    ['en', 'english'],
    ['cmn-Hans', '简体中文']
] as const;
