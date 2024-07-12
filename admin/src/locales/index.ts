// SPDX-FileCopyrightText: 2024 caixw
//
// SPDX-License-Identifier: MIT

import type { Messages } from './en';
export type { Messages } from './en';

export const locales = ['en', 'cmn-Hans'] as const;

export type Locale = typeof locales[number];

export const names: Array<[Locale, string]> = [
    [ 'en', 'english' ],
    ['cmn-Hans', '简体中文']
] as const;

export const loads: Record<Locale, {():Promise<Messages>}> = {
    'en': async()=>{return (await import('./en')).default;},
    'cmn-Hans': async()=>{return (await import('./cmn-Hans')).default;},
} as const;
