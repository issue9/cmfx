// SPDX-FileCopyrightText: 2025 caixw
//
// SPDX-License-Identifier: MIT

import { Dict, DictKeys, DisplayStyle, I18n, Locale, TranslateArgs } from '@cmfx/core';
import { createContext, createEffect, createSignal, JSX, ParentProps, useContext } from 'solid-js';

export type Props = ParentProps<{
    /**
     * 语言 ID
     *
     * @reactive
     */
    id: string;

    /**
     * 一些数据的显示风格
     *
     * @reactive
     */
    displayStyle: DisplayStyle;

    /**
     * 时区信息
     *
     * 该值必须是当前浏览器的 `Intl.supportedValuesOf('timeZone')` 的返回值之一。
     *
     * @reactive
     */
    timezone?: string;
}>;

const localeContext = createContext<Locale>();

function buildLocale(props: Props) {
    const [get, set] = createSignal<Locale>(new I18n(props.id, props.displayStyle, props.timezone));

    return {
        change(props: Props) {
            set(new I18n(props.id, props.displayStyle, props.timezone));
        },

        get locale(): Intl.Locale { return get().locale; },
        get displayStyle(): 'full' | 'short' | 'narrow' { return get().displayStyle; },
        get timezone(): string { return get().timezone; },
        datetimeFormat(o?: Intl.DateTimeFormatOptions): Intl.DateTimeFormat { return get().datetimeFormat(o); },
        dateFormat(o?: Intl.DateTimeFormatOptions): Intl.DateTimeFormat { return get().dateFormat(o); },
        timeFormat(o?: Intl.DateTimeFormatOptions): Intl.DateTimeFormat { return get().timeFormat(o); },
        numberFormat(o?: Intl.NumberFormatOptions): Intl.NumberFormat { return get().numberFormat(o); },
        durationFormat(o?: Intl.DurationFormatOptions): Intl.DurationFormat { return get().durationFormat(o); },
        relativeTimeFormat(o?: Intl.RelativeTimeFormatOptions): Intl.RelativeTimeFormat {
            return get().relativeTimeFormat(o);
        },
        match(locales: Array<string>): string { return get().match(locales); },
        get locales(): [id: string, displayName: string][] { return get().locales; },
        t<D extends Dict>(key: string | DictKeys<D>, args?: TranslateArgs): string { return get().t(key, args); },
        tt<D extends Dict>(locale: string, key: string | DictKeys<D>, args?: TranslateArgs): string {
            return get().tt(locale, key, args);
        },
    };
}


/**
 * 返回用于本地化的对象
 */
export function useLocale(): Locale {
    const ctx = useContext(localeContext);
    if (!ctx) { throw new Error('本地化的上下文环境还未初始化'); }
    return ctx;
}

/**
 * 指定新的本地化对象，其子类将采用此本地化对象。
 */
export function LocaleProvider(props: ParentProps<Props>): JSX.Element {
    const l = buildLocale(props);
    createEffect(() => { l.change(props); });
    return <localeContext.Provider value={l}>{props.children}</localeContext.Provider>;
}
