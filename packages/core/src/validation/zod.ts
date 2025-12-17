// SPDX-FileCopyrightText: 2025 caixw
//
// SPDX-License-Identifier: MIT

import * as z from 'zod';

import { Params } from '@/api';
import { Dict, DictLoader, I18n, Locale, matchLocales } from '@/locale';
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

const objects = I18n.createObject<any>('zod');

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
 * @param l - Locale 对象；
 * @typeParam T - 被验证对象的类型；
 */
export function validator<T extends Flattenable>(s: z.ZodObject, l?: Locale): Validator<T> {
    let errsMap: { localeError: any } | undefined = undefined;
    if (l) {
        const id = matchLocales(l.locale.toString(), locales, I18n.fallback, {localeMatcher: 'best fit'});
        errsMap = objects.get(id)!;
    }

    return {
        changeLocale(locale: Locale): void {
            const id = matchLocales(locale.locale.toString(), locales, I18n.fallback, { localeMatcher: 'best fit' });
            errsMap = objects.get(id)!;
        },

        async valid(obj: any, path?: FlattenKeys<T>): Promise<ValidResult<T>> {
            if (path) {
                let schema = s; // 参数 s 会重复使用，所以需要一个新的变量来保存 path 对应的值。
                const items = path.split('.');
                for (const item of items) {
                    schema = schema.shape[item];
                }

                const result = await schema.safeParseAsync(obj, errsMap ? { error: errsMap.localeError } : undefined);
                if (result.success) { return [result.data as T, undefined]; }

                const err = result.error.issues[0];
                return [undefined, [{ name: joinProperyKey(path, err.path) as FlattenKeys<T>, reason: err.message }]];
            }

            const result = await s.safeParseAsync(obj, errsMap ? { error: errsMap.localeError } : undefined);
            if (result.success) { return [result.data as T, undefined]; }

            const errors: Params<FlattenKeys<T>> = [];
            result.error.issues.map(i => {
                const p = joinProperyKey('', i.path) as FlattenKeys<T>;
                errors.push({ name: p, reason: i.message });
            });
            return [undefined, errors];
        }
    };
}

function joinProperyKey(p: string, keys: Array<PropertyKey>): string {
    for(const pp of keys) {
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
    return p;
}
