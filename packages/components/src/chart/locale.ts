// SPDX-FileCopyrightText: 2025 caixw
//
// SPDX-License-Identifier: MIT

import { matchLocales } from '@cmfx/core';
import * as echarts from 'echarts';

/**
 * 注册与 l 最匹配的语言
 */
export async function registerLocales(l: string) {
    const id = matchLocale(l);
    if (!locales.includes(id)) { // echarts 未提供的语言则直接忽略加载。
        return;
    }

    const obj = (await import(`../../../../node_modules/echarts/lib/i18n/lang${id}.js`)).default;
    echarts.registerLocale(id, obj);
}

/**
 * 从当前组件支持的语言中查找与 l 最匹配的语言
 */
export function matchLocale(l: string): LocaleID {
    return matchLocales(l, locales, l, {localeMatcher: 'best fit'}) as LocaleID;
}

// 当前组件支持的语言
//
// https://github.com/apache/echarts/tree/release/src/i18n
const locales = [
    'AR',
    'CS',
    'DE',
    'EN', // echarts 已经默认导入，但是还需要作语言匹配，所以不能省略。
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

type LocaleID = typeof locales[number];
