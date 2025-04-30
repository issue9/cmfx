// SPDX-FileCopyrightText: 2025 caixw
//
// SPDX-License-Identifier: MIT

import { Locale, UnitStyle } from '@cmfx/core';
import { createContext, JSX, ParentProps, splitProps, useContext } from 'solid-js';

export type Props = ParentProps<{
    id: string;
    unitStyle: UnitStyle;
}>;

const localeContext = createContext<Props>({ id: 'en', unitStyle: 'narrow' });

/**
 * 返回用于本地化的对象
 */
export function useLocale() {
    const ctx = useContext(localeContext);
    if (!ctx) {
        throw '未找到正确的 localeContext';
    }
    return new Locale(ctx.id, ctx.unitStyle);
}

/**
 * 指定新的本地化对象，其子类将采用此本地化对象。
 */
export function LocaleProvider(props: ParentProps<Props>): JSX.Element {
    const [p, _] = splitProps(props, ['id', 'unitStyle']);
    return <localeContext.Provider value={p}>{props.children}</localeContext.Provider>;
}
