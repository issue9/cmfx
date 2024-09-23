// SPDX-FileCopyrightText: 2024 caixw
//
// SPDX-License-Identifier: MIT

import '@formatjs/intl-durationformat/polyfill'; // TODO: https://caniuse.com/?search=durationformat
import { match } from '@formatjs/intl-localematcher';
import IntlMessageFormat from 'intl-messageformat';

import { API } from '@/core/api';
import { Dict, flatten, Keys } from './dict';

export class Locale {
    static #fallbck: string;
    static #api: API;
    static #messages: Map<string, Map<string, IntlMessageFormat>>;

    static init(fallback: string, api: API) {
        Locale.#fallbck = fallback;
        Locale.#messages = new Map();
        Locale.#api = api;
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
     * 在当前支持的语言中找出与 l 最匹配的语言
     */
    static matchLanguage(l: string): string {
        return match([l], Locale.languages(), Locale.#fallbck);
    }

    /**
     * 添加支持的语言及他它的翻译对象的加载方法
     */
    static async addDict(locale: string, ...loaders: Array<Loader>) {
        let dict: Dict = {};
        for(const l of loaders) {
            dict = { ...dict, ...await l() };
        }

        let msgs: Map<string, IntlMessageFormat>;
        if (Locale.#messages.has(locale)) {
            msgs = Locale.#messages.get(locale)!;
        } else {
            msgs = new Map<string, IntlMessageFormat>();
        }

        Object.entries(flatten(dict)).forEach((item) => {
            try {
                msgs.set(item[0], new IntlMessageFormat(item[1], locale));
            }catch (err) {
                console.error(`解析 ${item[1]} 是出现了错误 ${err}`);
            }
        });

        Locale.#messages.set(locale, msgs);
    }

    /**
     * 生成指定 ID 的本地化对象
     *
     * @@param locale 语言 ID，如果为空则采用浏览器 {@link navigator.language} 变量；
     */
    static build(locale?: string): Locale { return new Locale(locale); }

    #current: Map<string, IntlMessageFormat>;
    #locale: Intl.Locale;
    #date: Intl.DateTimeFormat;
    #bytes: Intl.NumberFormat;
    #duration: any; //Intl.DurationFormat;
    #displayNaes: Intl.DisplayNames;

    private constructor(locale?: string) {
        if (!locale) {
            locale = navigator.language;
        }

        this.#locale = new Intl.Locale(locale);
        Locale.#api.locale = this.#locale.language;

        const curr = Locale.#messages.get(Locale.matchLanguage(locale));
        if (curr) {
            this.#current = curr;
        } else {
            this.#current = new Map();
        }

        this.#date = new Intl.DateTimeFormat(locale, { timeStyle: 'short', dateStyle: 'short' });
        this.#bytes = new Intl.NumberFormat(locale, { style: 'unit', unit: 'kilobyte', unitDisplay: 'narrow' });
        this.#duration = new (Intl as any).DurationFormat(locale, {
            minute: '2-digit',
            second: '2-digit',
            fractionalSecondDigits: 3
        });
        this.#displayNaes = new Intl.DisplayNames(this.locale, { type: 'language', languageDisplay: 'dialect' });
    }

    get locale(): Intl.Locale { return this.#locale; }

    /**
     * 查找 locales 中与当前的语言最配的一个 ID，若是实在无法匹配，则返回 und。
     */
    match(locales: Array<string>) {
        return match([this.locale.toString()], locales, 'und');
    }

    /**
     * 返回支持的本地化列表
     */
    get locales() {
        const loc: Array<[string, string]> = [];
        Locale.#messages.forEach((_, key) => {
            loc.push([key, this.#displayNaes.of(key)!]);
        });
        return loc;
    }

    /**
     * 返回本地化的时间
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
    duration(val?: number | string): string {
        if (!val) { return ''; };
        return this.#duration.format({ nanoseconds: val });
    }

    /**
     * 返回本地化的字节数
     * @param bytes 需要格式化的字节数量
     */
    bytes(bytes: number): string {
        return this.#bytes.format(bytes);
    }

    /**
     * 翻译 key 指向的内容
     *
     * @template D 翻译字典的对象，若指定了该对象，则会采用该对象的字段名作为 key 参数的类型。
     */
    t<D extends Dict>(key: string | Keys<D>, args?: TArgs): string {
        const f = this.#current.get(key as string);
        return (f ? f.format(args) : key) as string;
    }

    /**
     * 以 locale 的指定的语言翻译 key 指向的内容
     *
     * @template D 翻译字典的对象，若指定了该对象，则会采用该对象的字段名作为 key 参数的类型。
     */
    tt<D extends Dict>(locale: string, key: string | Keys<D>, args?: TArgs): string {
        const msgs = Locale.#messages.get(Locale.matchLanguage(locale));
        if (!msgs) {
            return key as string;
        }

        const f = msgs.get(key as string);
        return (f ? f.format(args) : key) as string;
    }
}

type TArgs = Parameters<IntlMessageFormat['format']>[0];

/**
 * 表示语言 ID 以对应加载方法的对象
 *
 * 字段名为语言 ID，值为加载相应语言的方法。
 */
export type Loader = { (): Promise<Dict> };
