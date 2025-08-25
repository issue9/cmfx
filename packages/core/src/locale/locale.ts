// SPDX-FileCopyrightText: 2024-2025 caixw
//
// SPDX-License-Identifier: MIT

import IntlMessageFormat from 'intl-messageformat';

import { Dict, dictFlatten, DictKeys, Loader } from './dict';
import { match } from './match';

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

/**
 * 提供本地化相关的功能
 *
 * 除了翻译之外，对于一些常用的格式比如日期等也提供了支持。
 */
export class Locale {
    static #fallback: string;
    static #messages: Map<string, Map<string, IntlMessageFormat>>;

    /**
     * 初始化
     *
     * @param fallback - 在找不到对应在的语言时采用的默认值；
     */
    static init(fallback: string) {
        Locale.#fallback = fallback;
        Locale.#messages = new Map();
    }

    /**
     * 支持的语言数量
     */
    static languageSize(): number { return Locale.#messages.size; }

    /**
     * 支持语言列表
     */
    static languages(): Array<string> { return [...Locale.#messages.keys()]; }

    /**
     * 以 locale 的指定的语言翻译 key 指向的内容
     *
     * @typeParam D - 翻译字典的对象，若指定了该对象，则会采用该对象的字段名作为 key 参数的类型。
     */
    static translate<D extends Dict>(locale: string, key: string | DictKeys<D>, args?: TranslateArgs): string {
        const msgs = Locale.#messages.get(Locale.matchLanguage(locale));
        if (!msgs) { return key as string; }

        const f = msgs.get(key as string);
        return (f ? f.format(args) : key) as string;
    }

    /**
     * 在当前支持的语言中找出与 l 最匹配的语言
     */
    static matchLanguage(l: string): string {
        if (Locale.#messages.has(l)) { return l; }

        return match(l, Locale.languages(), Locale.#fallback);
    }

    /**
     * 添加支持的语言及他它的翻译对象的加载方法
     */
    static async addDict(locale: string, ...loaders: Array<Loader>) {
        let msgs: Map<string, IntlMessageFormat>;
        if (Locale.#messages.has(locale)) {
            msgs = Locale.#messages.get(locale)!;
        } else {
            msgs = new Map<string, IntlMessageFormat>();
        }

        for (const l of loaders) {
            Object.entries<string>(dictFlatten(await l())).forEach((item) => {
                try {
                    msgs.set(item[0], new IntlMessageFormat(item[1], locale));
                } catch (err) {
                    console.error(`解析 ${item[1]} 是出现了错误 ${err}`);
                }
            });

            Locale.#messages.set(locale, msgs);
        }
    }

    readonly #current: Map<string, IntlMessageFormat>;
    readonly #locale: Intl.Locale;
    readonly #displayStyle: DisplayStyle;

    readonly #dtStyle: Intl.DateTimeFormatOptions['timeStyle'];
    readonly #durationStyle: Intl.RelativeTimeFormatOptions['style'];
    readonly #numberStyle: Intl.NumberFormatOptions['unitDisplay'];

    readonly #displayNames: Intl.DisplayNames;
    readonly #timezone: string;

    /**
     * 构造函数
     * @param locale - 本地化字符串；
     * @param style - 显示风格；
     * @param tz - 时区；
     */
    constructor(locale: string, style: DisplayStyle, tz?: string) {
        locale = Locale.matchLanguage(locale); // 找出当前支持的语言中与参数指定最匹配的项
        const curr = Locale.#messages.get(locale);
        if (curr) {
            this.#current = curr;
        } else {
            this.#current = new Map();
        }

        this.#locale = new Intl.Locale(locale);

        this.#displayStyle = style;
        switch (style) {
        case 'full':
            this.#dtStyle = 'full';
            this.#durationStyle = 'long';
            this.#numberStyle = 'long';
            break;
        case 'short':
            this.#dtStyle = 'medium';
            this.#durationStyle = 'short';
            this.#numberStyle = 'short';
            break;
        case 'narrow':
            this.#dtStyle = 'short';
            this.#durationStyle = 'narrow';
            this.#numberStyle = 'narrow';
            break;
        default:
            throw `参数 style 的值无效 ${style}`;
        }
        this.#displayNames = new Intl.DisplayNames(this.locale, { type: 'language', languageDisplay: 'dialect' });

        this.#timezone = tz || Intl.DateTimeFormat().resolvedOptions().timeZone;
    }

    get locale(): Intl.Locale { return this.#locale; }

    get displayStyle(): DisplayStyle { return this.#displayStyle; }

    get timezone(): string { return this.#timezone; }

    /**
     * 创建 {@link Intl#DateTimeFormat} 对象
     *
     * NOTE: 如果 o.timeStyle 和 o.dateStyle 都未指定，则使用构造函数指定的 style 参数。
     * 如果 o.timeZone 未指定，则使用构造函数指定的 timeZone 参数。
     */
    datetimeFormat(o?: Intl.DateTimeFormatOptions): Intl.DateTimeFormat {
        if (!o) {
            o = { timeStyle: this.#dtStyle, dateStyle: this.#dtStyle, timeZone: this.timezone };
        } else {
            if (!o.dateStyle) { o.dateStyle = this.#dtStyle; }
            if (!o.timeStyle) { o.timeStyle = this.#dtStyle; }
            if (!o.timeZone) { o.timeZone = this.timezone; }
        }

        return new Intl.DateTimeFormat(this.locale, o);
    }

    /**
     * 创建 {@link Intl#DateTimeFormat} 对象，只打印日期部分。
     */
    dateFormat(o?: Intl.DateTimeFormatOptions): Intl.DateTimeFormat {
        if (!o) {
            o = { dateStyle: this.#dtStyle, timeZone: this.timezone };
        } else {
            if (!o.dateStyle) { o.dateStyle = this.#dtStyle; }
            if (!o.timeZone) { o.timeZone = this.timezone; }
        }
        o.timeStyle = undefined;


        return new Intl.DateTimeFormat(this.locale, o);
    }

    /**
     * 创建 {@link Intl#DateTimeFormat} 对象，只打印时间部分。
     */
    timeFormat(o?: Intl.DateTimeFormatOptions): Intl.DateTimeFormat {
        if (!o) {
            o = { timeStyle: this.#dtStyle, timeZone: this.timezone };
        } else {
            if (!o.timeStyle) { o.timeStyle = this.#dtStyle; }
            if (!o.timeZone) { o.timeZone = this.timezone; }
        }
        o.dateStyle = undefined;

        return new Intl.DateTimeFormat(this.locale, o);
    }

    /**
     * 创建 {@link Intl#NumberFormat} 对象
     *
     * NOTE: 如果 o.unitDisplay 未指定，则使用构造函数指定的 style 参数。
     */
    numberFormat(o?: Intl.NumberFormatOptions): Intl.NumberFormat {
        if (!o) {
            o = { unitDisplay: this.#numberStyle };
        } else if (!o.unitDisplay) {
            o.unitDisplay = this.#numberStyle;
        }

        return new Intl.NumberFormat(this.locale, o);
    }

    /**
     * 创建 {@link Intl#DurationFormat} 对象
     *
     * NOTE: 如果 o.style 未指定，则使用构造函数指定的 style 参数。
     */
    durationFormat(o?: Intl.DurationFormatOptions): Intl.DurationFormat {
        if (!o) {
            o = { style: this.#durationStyle };
        } else if (!o.style) {
            o.style = this.#durationStyle;
        }

        return new (Intl as any).DurationFormat(this.locale, o);
    }

    /**
     * 创建 {@link Intl#RelativeTimeFormat} 对象
     *
     * NOTE: 如果 o.style 未指定，则使用构造函数指定的 style 参数。
     */
    relativeTimeFormat(o?: Intl.RelativeTimeFormatOptions): Intl.RelativeTimeFormat {
        if (!o) {
            o = { style: this.#durationStyle };
        } else if (!o.style) {
            o.style = this.#durationStyle; // style 与 druationFormat 的取值相同
        }

        return new Intl.RelativeTimeFormat(this.locale, o);
    }

    /**
     * 查找 locales 中与当前的语言最配的一个 ID，若是实在无法匹配，则返回 und。
     */
    match(locales: Array<string>) { return match(this.locale.toString(), locales, 'und'); }

    /**
     * 返回支持的本地化列表
     */
    get locales() {
        const loc: Array<[string, string]> = [];
        Locale.#messages.forEach((_, key) => {
            loc.push([key, this.#displayNames.of(key)!]);
        });
        return loc;
    }

    /**
     * 翻译 key 指向的内容
     *
     * @typeParam D - 翻译字典的对象，若指定了该对象，则会采用该对象的字段名作为 key 参数的类型。
     */
    t<D extends Dict>(key: string | DictKeys<D>, args?: TranslateArgs): string {
        const f = this.#current.get(key as string);
        return (f ? f.format(args) : key) as string;
    }

    /**
     * 以 locale 的指定的语言翻译 key 指向的内容
     *
     * @typeParam D - 翻译字典的对象，若指定了该对象，则会采用该对象的字段名作为 key 参数的类型。
     */
    tt<D extends Dict>(locale: string, key: string | DictKeys<D>, args?: TranslateArgs): string {
        return Locale.translate(locale, key, args);
    }
}

export type TranslateArgs = Parameters<IntlMessageFormat['format']>[0];
