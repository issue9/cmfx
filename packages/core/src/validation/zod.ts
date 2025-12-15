// SPDX-FileCopyrightText: 2025 caixw
//
// SPDX-License-Identifier: MIT

import * as z from 'zod';

import { Params } from '@/api';
import { Dict, DictLoader, Locale, matchLocales } from '@/locale';
import { FlattenKeys, Flattenable } from '@/types';
import { ValidResult, Validator } from './validation';

const locales = [
    'ar',
    'az',
    'be',
    'bg',
    'ca',
    'cs',
    'da',
    'de',
    'en',
    'eo',
    'es',
    'fa',
    'fi',
    'fr',
    'fr-CA',
    'he',
    'hu',
    'id',
    'is',
    'it',
    'ja',
    'ka',
    'km',
    'ko',
    'lt',
    'mk',
    'ms',
    'nl',
    'no',
    'ota',
    'ps',
    'pl',
    'pt',
    'ru',
    'sl',
    'sv',
    'ta',
    'th',
    'tr',
    'uk',
    'ur',
    'vi',
    'zh-CN',
    'zh-TW',
    'yo',
];

type LocaleID = typeof locales[number];

const objects = Locale.createObject<any>('zod');

/**
 * 创建一个用于加载 zod 本地化语言的函数
 *
 * @param f - 加载 zod 本地化语言内容，比如 `(await import('../../node_modules/zod/v4/locales/en.js')).default`；
 * @returns 返回的是一个 {@link DictLoader} 函数，可在 {@link Locale.addDict} 中使用；
 */
export function createZodLocaleLoader(f: () => any): DictLoader {
    return async (locale: string): Promise<Dict | undefined> => {
        objects.set(locale, f());
        return undefined;
    };
}

/**
 * 将 {@link z.ZodObject | Zod} 对象包装为 {@link Validator} 方法
 *
 * @param s - zod schema；
 * @param l - 本地化语言的 ID；
 * @typeParam T - 被验证对象的类型；
 */
export function validator<T extends Flattenable>(s: z.ZodObject, l?: Locale): Validator<T> {
    return async(obj: T): Promise<ValidResult<T>> => {
        if (l) {
            const id = matchLocales(l.locale.toString(), locales, 'en', {localeMatcher: 'best fit'}) as LocaleID;
            var errsMap = objects.get(id)!;
        }

        const result = await s.safeParseAsync(obj, l ? { error: errsMap.localeError } : undefined);
        if (result.success) { return [result.data as T, undefined]; }

        const errors: Params<FlattenKeys<T>> = [];
        result.error.issues.map(i => {
            let p = '';
            for(const pp of i.path) {
                switch (typeof pp) {
                case 'number':
                    p += `[${pp}]`;
                    break;
                case 'string':
                    if (p) {
                        p += `.${pp}`;
                    } else {
                        p = pp;
                    }
                }
            }
            errors.push({ name: p as FlattenKeys<T>, reason: i.message });
        });
        return [undefined, errors];
    };
}
