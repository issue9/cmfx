// SPDX-FileCopyrightText: 2025-2026 caixw
//
// SPDX-License-Identifier: MIT

import IntlMessageFormat from 'intl-messageformat';

import { Dict, DictKeys } from './dict';

export const displayStyles = ['full', 'short', 'narrow'] as const;

/**
 * 一些与本地化相关的单位名称的显示方式
 *
 *  - full 显示完整的名称；
 *  - short 显示简短的名称；
 *  - narrow 以最简单的方式显示；
 *
 * 主要是针对 {@link Intl} 的一些预设，如果需要精细的控制，可自己实现。
 */
export type DisplayStyle = typeof displayStyles[number];

export type TranslateArgs = Parameters<IntlMessageFormat['format']>[0];

/**
 * 提供本地化的接口
 *
 * @remarks
 * 除了翻译之外，对于一些常用的格式比如日期等也提供了支持。
 */
export interface Locale {
    get locale(): Intl.Locale;

    get displayStyle(): DisplayStyle;

    get timezone(): string;

    /**
     * 创建 {@link Intl#DateTimeFormat} 对象
     *
     * NOTE: 如果 o.timeStyle 和 o.dateStyle 都未指定，则使用构造函数指定的 style 参数。
     * 如果 o.timeZone 未指定，则使用构造函数指定的 timeZone 参数。
     */
    datetimeFormat(o?: Intl.DateTimeFormatOptions): Intl.DateTimeFormat;

    /**
     * 创建 {@link Intl#DateTimeFormat} 对象，只打印日期部分。
     */
    dateFormat(o?: Intl.DateTimeFormatOptions): Intl.DateTimeFormat;

    /**
     * 创建 {@link Intl#DateTimeFormat} 对象，只打印时间部分。
     */
    timeFormat(o?: Intl.DateTimeFormatOptions): Intl.DateTimeFormat;

    /**
     * 创建 {@link Intl#NumberFormat} 对象
     *
     * NOTE: 如果 o.unitDisplay 未指定，则使用构造函数指定的 style 参数。
     */
    numberFormat(o?: Intl.NumberFormatOptions): Intl.NumberFormat;

    /**
     * 创建 {@link Intl#DurationFormat} 对象
     *
     * NOTE: 如果 o.style 未指定，则使用构造函数指定的 style 参数。
     */
    durationFormat(o?: Intl.DurationFormatOptions): Intl.DurationFormat;

    /**
     * 创建 {@link Intl#RelativeTimeFormat} 对象
     *
     * NOTE: 如果 o.style 未指定，则使用构造函数指定的 style 参数。
     */
    relativeTimeFormat(o?: Intl.RelativeTimeFormatOptions): Intl.RelativeTimeFormat;

    /**
     * 查找 locales 中与当前的语言最配的一个 ID，若是实在无法匹配，则返回 preset。
     */
    match(locales: Array<string>, preset: string): string;

    /**
     * 返回支持的本地化列表
     *
     * @returns 返回语言 id 与语言名称的列表；
     */
    get locales(): Array<[id: string, displayName: string]>;

    /**
     * 翻译 key 指向的内容
     *
     * @typeParam D - 翻译字典的对象，若指定了该对象，则会采用该对象的字段名作为 key 参数的类型。
     */
    t<D extends Dict>(key: string | DictKeys<D>, args?: TranslateArgs): string;

    /**
     * 以 locale 的指定的语言翻译 key 指向的内容
     *
     * @typeParam D - 翻译字典的对象，若指定了该对象，则会采用该对象的字段名作为 key 参数的类型。
     */
    tt<D extends Dict>(locale: string, key: string | DictKeys<D>, args?: TranslateArgs): string;
}
