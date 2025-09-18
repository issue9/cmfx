// SPDX-FileCopyrightText: 2025 caixw
//
// SPDX-License-Identifier: MIT

import { Locale as CoreLocale, DisplayStyle } from '@cmfx/core';
import { createContext, createEffect, JSX, ParentProps, useContext } from 'solid-js';

import { buildLocale, Locale } from '@/base/locale';

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

/**
 * 返回用于本地化的对象
 */
export function useLocale(): Locale {
    const ctx = useContext(localeContext);
    if (!ctx) {
        throw new Error('本地化的上下文环境还未初始化');
    }
    return ctx;
}

/**
 * 指定新的本地化对象，其子类将采用此本地化对象。
 */
export function LocaleProvider(props: ParentProps<Props>): JSX.Element {
    const v = buildLocale(new CoreLocale(props.id, props.displayStyle, props.timezone));

    createEffect(() => {
        v.changeLocale(new CoreLocale(props.id, props.displayStyle, props.timezone));
    });

    return <localeContext.Provider value={v}>{props.children}</localeContext.Provider>;
}
