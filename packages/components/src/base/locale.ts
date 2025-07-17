// SPDX-FileCopyrightText: 2025 caixw
//
// SPDX-License-Identifier: MIT

import { Locale as CoreLocale, Dict, DictKeys, TranslateArgs, UnitStyle } from '@cmfx/core';
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

        get unitStyle(): UnitStyle { return l[0].l.unitStyle; },

        /**
         * 创建 {@link Intl#DateTimeFormat} 对象
         */
        datetimeFormat(o?: Intl.DateTimeFormatOptions): Intl.DateTimeFormat {
            return l[0].l.dateTimeFormat(o);
        },

        /**
         * 创建 {@link Intl#NumberFormat} 对象
         */
        numberFormat(o?: Intl.NumberFormatOptions): Intl.NumberFormat {return l[0].l.numberFormat(o); },

        /**
         * 创建 {@link DurationFormat} 对象
         */
        durationFormat(o?: Intl.DurationFormatOptions): Intl.DurationFormat { return l[0].l.durationFormat(o); },

        /**
         * 查找 locales 中与当前的语言最配的一个 ID，若是实在无法匹配，则返回 und。
         */
        match(locales: Array<string>): string { return l[0].l.match(locales); },

        /**
         * 返回支持的本地化列表
         */
        get locales(): Array<[string, string]> { return l[0].l.locales; },

        /**
         * 用于同时格式化日期和时间的对象
         */
        get datetime(): Intl.DateTimeFormat { return l[0].l.datetime; },

        /**
         * 用于格式化时期部分的格式化对象
         */
        get date(): Intl.DateTimeFormat { return l[0].l.date; },

        /**
         * 用于格式化时间部分的格式化对象
         */
        get time(): Intl.DateTimeFormat { return l[0].l.time; },

        /**
         *返回本地化的时间区间的对象
         */
        get duration(): Intl.DurationFormat { return l[0].l.duration; },

        /**
         * 返回本地化的字节数
         * @param bytes 需要格式化的字节数量
         */
        bytes(bytes: number): string { return l[0].l.bytes(bytes); },

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
