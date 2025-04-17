// SPDX-FileCopyrightText: 2025 caixw
//
// SPDX-License-Identifier: MIT

import { matchLocales } from '@cmfx/core';
import * as echarts from 'echarts';

/**
 * 为当前组件注册指定的本地化语言
 */
export async function registerLocales(l: string) {
    const id = matchLocale(l);
    const obj = (await import(`echarts/i18n/lang${id}.js`)).default;
    echarts.registerLocale(id, obj);
}

/**
 * 从当前组支持的语言中查找与 l 最匹配的语言
 */
export function matchLocale(l: string) { return matchLocales(l, locales, l, {localeMatcher: 'best fit'}); }

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
