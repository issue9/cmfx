// SPDX-FileCopyrightText: 2025 caixw
//
// SPDX-License-Identifier: MIT

import * as z from 'zod';
import { FlattenKeys, Flattenable } from '@/types';

import { Locale, matchLocales } from '@/locale';
import { Params } from '@/api';
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

/**
 * 将 {@link z.ZodObject | Zod} 对象包装为 {@link Validator} 方法
 */
export function validator<T extends Flattenable>(s: z.ZodObject, l?: Locale): Validator<T> {
    return async(obj: T): Promise<ValidResult<T>> => {
        if (l) {
            const lid = l.locale.toString();
            const id = matchLocales(lid, locales, 'en', {localeMatcher: 'best fit'}) as LocaleID;
            const { default: locale } = await import(`zod/v4/locales/${id}.js`);
            var errsMap = locale();
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
