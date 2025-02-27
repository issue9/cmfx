// SPDX-FileCopyrightText: 2025 caixw
//
// SPDX-License-Identifier: MIT

import { match } from '@formatjs/intl-localematcher';

/**
 * 为当前组件注册指定的本地化语言
 */
export async function registerLocales(l: string) {
    const id = matchLocale(l);
    await import(`../../../../node_modules/echarts/i18n/lang${id}-obj.js`);
}

/**
 * 从当前组支持的语言中查找与 l 最匹配的语言
 */
export function matchLocale(l: string) { return match([l], locales, l); }

// 当前组件支持的语言
//
// https://github.com/apache/echarts/tree/release/src/i18n
const locales = [
    'AR',
    'CS',
    'DE',
    'EN',
    'ES',
    'FA',
    'FI',
    'FR',
    'HU',
    'IT',
    'JA',
    'KO',
    'NL',
    'PL',
    'PT-br',
    'RO',
    'RU',
    'SI',
    'SV',
    'TH',
    'TR',
    'UK',
    'VI',
    'ZH',
] as const;
