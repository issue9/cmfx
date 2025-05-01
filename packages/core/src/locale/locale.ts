// SPDX-FileCopyrightText: 2024-2025 caixw
//
// SPDX-License-Identifier: MIT

import IntlMessageFormat from 'intl-messageformat';

import { Duration, formatDuration, parseDuration } from '@/time';
import { Dict, flatten, Keys, Loader } from './dict';
import { match } from './match';

export const unitStyles = ['full', 'short', 'narrow'] as const;

/**
 * 一些与本地化相关的单位名称的显示方式
 * 
 *  - full 显示完整的名称；
 *  - short 显示简短的名称；
 *  - narrow 以最简单的方式显示；
 *
 * 主要是针对 {@link Intl} 的一些预设，如果需要精细的控制，可自己实现。
 */
export type UnitStyle = typeof unitStyles[number];

const kb = 1024;
const mb = kb * 1024;
const gb = mb * 1024;
const tb = gb * 1024;

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
     * @param fallback 在找不到对应在的语言时采用的默认值；
     * @param api 切换语言时会同时切换 api 的 accept-language 报头；
     */
    static init(fallback: string) {
        Locale.#fallback = fallback;
        Locale.#messages = new Map();
    }

    /**
     * 支持几种语言
     */
    static languageSize(): number { return Locale.#messages.size; }

    /**
     * 支持语言列表
     */
    static languages(): Array<string> { return [...Locale.#messages.keys()]; }

    /**
     * 以 locale 的指定的语言翻译 key 指向的内容
     *
     * @template D 翻译字典的对象，若指定了该对象，则会采用该对象的字段名作为 key 参数的类型。
     */
    static translate<D extends Dict>(locale: string, key: string | Keys<D>, args?: TranslateArgs): string {
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
            Object.entries(flatten(await l())).forEach((item) => {
                try {
                    msgs.set(item[0], new IntlMessageFormat(item[1], locale));
                } catch (err) {
                    console.error(`解析 ${item[1]} 是出现了错误 ${err}`);
                }
            });

            Locale.#messages.set(locale, msgs);
        }
    }

    #current: Map<string, IntlMessageFormat>;
    readonly #locale: Intl.Locale;
    readonly #unitStyle: UnitStyle;

    #datetime: Intl.DateTimeFormat;
    #date: Intl.DateTimeFormat;

    #B: Intl.NumberFormat;
    #kB: Intl.NumberFormat;
    #mB: Intl.NumberFormat;
    #gB: Intl.NumberFormat;
    #tB: Intl.NumberFormat;

    #duration: Intl.DurationFormat;
    #displayNames: Intl.DisplayNames;

    constructor(locale: string, style: UnitStyle) {
        locale = Locale.matchLanguage(locale); // 找出当前支持的语言中与参数指定最匹配的项
        const curr = Locale.#messages.get(locale);
        if (curr) {
            this.#current = curr;
        } else {
            this.#current = new Map();
        }

        this.#unitStyle = style;
        this.#locale = new Intl.Locale(locale);

        let dtStyle: Intl.DateTimeFormatOptions['timeStyle'] = 'medium';
        let byteStyle: Intl.NumberFormatOptions['unitDisplay'] = 'narrow';
        let durationStyle: Intl.DurationFormatOptions['style'] = 'narrow';

        switch (style) {
        case 'full':
            dtStyle = 'full';
            byteStyle = 'long';
            durationStyle = 'long';
            break;
        case 'short':
            dtStyle = 'medium';
            byteStyle = 'short';
            durationStyle = 'short';
            break;
        case 'narrow':
            dtStyle = 'short';
            byteStyle = 'narrow';
            durationStyle = 'narrow';
            break;
        default:
            throw `参数 style 的值无效 ${style}`;
        }

        this.#datetime = this.dateTimeFormat({ timeStyle: dtStyle, dateStyle: dtStyle });
        this.#date = this.dateTimeFormat({ dateStyle: dtStyle });

        this.#B = this.numberFormat({ style: 'unit', unit: 'byte', unitDisplay: byteStyle });
        this.#kB = this.numberFormat({ style: 'unit', unit: 'kilobyte', unitDisplay: byteStyle });
        this.#mB = this.numberFormat({ style: 'unit', unit: 'megabyte', unitDisplay: byteStyle });
        this.#gB = this.numberFormat({ style: 'unit', unit: 'gigabyte', unitDisplay: byteStyle });
        this.#tB = this.numberFormat({ style: 'unit', unit: 'terabyte', unitDisplay: byteStyle });

        this.#duration = this.durationFormat({style: durationStyle, fractionalDigits: 3});

        this.#displayNames = new Intl.DisplayNames(this.locale, { type: 'language', languageDisplay: 'dialect' });
    }

    get locale(): Intl.Locale { return this.#locale; }

    get unitStyle(): UnitStyle { return this.#unitStyle; }

    /**
     * 创建 {@link Intl#DateTimeFormat} 对象
     */
    dateTimeFormat(o: Intl.DateTimeFormatOptions): Intl.DateTimeFormat {
        return new Intl.DateTimeFormat(this.locale, o);
    }

    /**
     * 创建 {@link Intl#NumberFormat} 对象
     */
    numberFormat(o: Intl.NumberFormatOptions): Intl.NumberFormat {
        return new Intl.NumberFormat(this.locale, o);
    }

    /**
     * 创建 {@link DurationFormat} 对象
     */
    durationFormat(o: Intl.DurationFormatOptions): Intl.DurationFormat {
        return new (Intl as any).DurationFormat(this.locale, o);
    }

    /**
     * 查找 locales 中与当前的语言最配的一个 ID，若是实在无法匹配，则返回 und。
     */
    match(locales: Array<string>) {
        return match(this.locale.toString(), locales, 'und');
    }

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
     * 返回本地化的时间
     * @param d 时间，如果是 number 类型，表示的是毫秒；
     * @returns 根据本地化格式的字符串
     */
    datetime(d?: Date | string | number): string {
        if (d === undefined) { return ''; }
        return this.#datetime.format(new Date(d));
    }

    /**
     * 返回本地化的日期
     * @param d 时间，如果是 number 类型，表示的是毫秒；
     * @returns 根据本地化格式的字符串
     */
    date(d?: Date | string | number): string {
        if (d === undefined) { return ''; }
        return this.#date.format(new Date(d));
    }

    /**
     *返回本地化的时间区间
     */
    duration(val?: Duration): string {
        return this.#duration.format(formatDuration(parseDuration(val)));
    }

    /**
     * 返回本地化的字节数
     * @param bytes 需要格式化的字节数量
     */
    bytes(bytes: number): string {
        if (bytes < kb) {
            return this.#B.format(bytes);
        } else if (bytes < mb) {
            return this.#kB.format(bytes/kb);
        } else if (bytes < gb) {
            return this.#mB.format(bytes/mb);
        } else if (bytes < tb) {
            return this.#gB.format(bytes/gb);
        } else {
            return this.#tB.format(bytes/tb);
        }
    }

    /**
     * 翻译 key 指向的内容
     *
     * @template D 翻译字典的对象，若指定了该对象，则会采用该对象的字段名作为 key 参数的类型。
     */
    t<D extends Dict>(key: string | Keys<D>, args?: TranslateArgs): string {
        const f = this.#current.get(key as string);
        return (f ? f.format(args) : key) as string;
    }

    /**
     * 以 locale 的指定的语言翻译 key 指向的内容
     *
     * @template D 翻译字典的对象，若指定了该对象，则会采用该对象的字段名作为 key 参数的类型。
     */
    tt<D extends Dict>(locale: string, key: string | Keys<D>, args?: TranslateArgs): string {
        return Locale.translate(locale, key, args);
    }
}

export type TranslateArgs = Parameters<IntlMessageFormat['format']>[0];
