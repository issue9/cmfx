// SPDX-FileCopyrightText: 2025 caixw
//
// SPDX-License-Identifier: MIT

import { Locale as CoreLocale, Dict, DictKeys, DisplayStyle, TranslateArgs } from '@cmfx/core';
import { createStore } from 'solid-js/store';

/**
 * 本地化对象
 */
export type Locale = ReturnType<typeof buildLocale>;

export function buildLocale(cl: CoreLocale) {
    const l = createStore<{ l: CoreLocale }>({l:cl});

    return {
        changeLocale(cl: CoreLocale) { l[1]({ l: cl }); },

        get locale(): Intl.Locale { return l[0].l.locale; },

        get displayStyle(): DisplayStyle  { return l[0].l.displayStyle; },

        /**
         * 创建 {@link Intl#DateTimeFormat} 对象
         *
         * NOTE: 如果 o.timeStyle 和 o.dateStyle 都未指定，则使用构造函数指定的 style 参数。
         */
        datetimeFormat(o?: Intl.DateTimeFormatOptions): Intl.DateTimeFormat {
            return l[0].l.datetimeFormat(o);
        },

        /**
         * 创建 {@link Intl#DateTimeFormat} 对象，只打印日期部分。
         */
        dateFormat(o?: Intl.DateTimeFormatOptions): Intl.DateTimeFormat {
            return l[0].l.dateFormat(o);
        },

        /**
         * 创建 {@link Intl#DateTimeFormat} 对象，只打印时间部分。
         */
        timeFormat(o?: Intl.DateTimeFormatOptions): Intl.DateTimeFormat {
            return l[0].l.timeFormat(o);
        },

        /**
         * 创建 {@link Intl#NumberFormat} 对象
         *
         * NOTE: 如果 o.unitDisplay 未指定，则使用构造函数指定的 style 参数。
         */
        numberFormat(o?: Intl.NumberFormatOptions): Intl.NumberFormat {return l[0].l.numberFormat(o); },

        /**
         * 创建 {@link DurationFormat} 对象
         *
         * NOTE: 如果 o.style 未指定，则使用构造函数指定的 style 参数。
         */
        durationFormat(o?: Intl.DurationFormatOptions): Intl.DurationFormat { return l[0].l.durationFormat(o); },

        /**
         * 创建 {@link Intl#RelativeTimeFormat} 对象
         *
         * NOTE: 如果 o.style 未指定，则使用构造函数指定的 style 参数。
         */
        relativeTimeFormat(o?: Intl.RelativeTimeFormatOptions): Intl.RelativeTimeFormat {
            return l[0].l.relativeTimeFormat(o);
        },

        /**
         * 查找 locales 中与当前的语言最配的一个 ID，若是实在无法匹配，则返回 und。
         */
        match(locales: Array<string>): string { return l[0].l.match(locales); },

        /**
         * 返回支持的本地化列表
         */
        get locales(): Array<[string, string]> { return l[0].l.locales; },

        /**
         * 翻译 key 指向的内容
         *
         * @template D 翻译字典的对象，若指定了该对象，则会采用该对象的字段名作为 key 参数的类型。
         */
        t<D extends Dict>(key: string | DictKeys<D>, args?: TranslateArgs): string {
            return l[0].l.t(key, args);
        },

        /**
         * 以 locale 的指定的语言翻译 key 指向的内容
         *
         * @template D 翻译字典的对象，若指定了该对象，则会采用该对象的字段名作为 key 参数的类型。
         */
        tt<D extends Dict>(locale: string, key: string | DictKeys<D>, args?: TranslateArgs): string {
            return l[0].l.tt(locale, key, args);
        },
    };
}
