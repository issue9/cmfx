// SPDX-FileCopyrightText: 2025 caixw
//
// SPDX-License-Identifier: MIT

import { Dict, DictKeys, DisplayStyle, I18n, Locale, TranslateArgs } from '@cmfx/core';
import { Accessor, createContext, createEffect, createSignal, JSX, ParentProps, useContext } from 'solid-js';

import { ContextNotFoundError } from './errors';

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

const localeContext = createContext<Accessor<Locale>>();

/**
 * 返回用于本地化的对象
 */
export function useLocale(): Locale {
    const ctx = useContext(localeContext);
    if (!ctx) { throw new ContextNotFoundError('localeContext'); }

    return {
        get locale(): Intl.Locale { return ctx().locale; },
        get displayStyle(): DisplayStyle { return ctx().displayStyle; },
        get timezone(): string { return ctx().timezone; },
        datetimeFormat(o?: Intl.DateTimeFormatOptions): Intl.DateTimeFormat { return ctx().datetimeFormat(o); },
        dateFormat(o?: Intl.DateTimeFormatOptions): Intl.DateTimeFormat { return ctx().dateFormat(o); },
        timeFormat(o?: Intl.DateTimeFormatOptions): Intl.DateTimeFormat { return ctx().timeFormat(o); },
        numberFormat(o?: Intl.NumberFormatOptions): Intl.NumberFormat { return ctx().numberFormat(o); },
        durationFormat(o?: Intl.DurationFormatOptions): Intl.DurationFormat { return ctx().durationFormat(o); },
        relativeTimeFormat(o?: Intl.RelativeTimeFormatOptions): Intl.RelativeTimeFormat {
            return ctx().relativeTimeFormat(o);
        },
        match(locales: Array<string>): string { return ctx().match(locales); },
        get locales(): [id: string, displayName: string][] { return ctx().locales; },
        t<D extends Dict>(key: string | DictKeys<D>, args?: TranslateArgs): string { return ctx().t(key, args); },
        tt<D extends Dict>(locale: string, key: string | DictKeys<D>, args?: TranslateArgs): string {
            return ctx().tt(locale, key, args);
        },
    };
}

/**
 * 指定新的本地化对象，其子类将采用此本地化对象。
 */
export function LocaleProvider(props: ParentProps<Props>): JSX.Element {
    const [g, s] = createSignal<Locale>(new I18n(props.id, props.displayStyle, props.timezone));
    createEffect(() => { s(new I18n(props.id, props.displayStyle, props.timezone)); });
    return <localeContext.Provider value={g}>{props.children}</localeContext.Provider>;
}
