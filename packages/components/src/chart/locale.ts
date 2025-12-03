// SPDX-FileCopyrightText: 2025 caixw
//
// SPDX-License-Identifier: MIT

import { matchLocales, DictLoader, Dict } from '@cmfx/core';
import * as echarts from 'echarts';

/**
 * 创建用于加载 echarts 语言包的加载器
 * @param obj - 需要加载的内容，比如 `(await import(`../../node_modules/echarts/lib/i18n/langEN.js`)).default`；
 * @returns 返回的是一个 {@link DictLoader} 函数，可在 {@link Locale.addDict} 中使用；
 */
export function createChartLocaleLoader(obj: Parameters<typeof echarts.registerLocale>[1]): DictLoader {
    return async (locale: string): Promise<Dict | undefined> => {
        const id = matchLocale(locale);
        if (!locales.includes(id)) { return; }// echarts 未提供的语言则直接忽略加载。

        echarts.registerLocale(id, obj);
        return undefined;
    };
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
