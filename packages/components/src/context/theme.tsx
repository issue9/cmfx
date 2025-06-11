// SPDX-FileCopyrightText: 2025 caixw
//
// SPDX-License-Identifier: MIT

import { children, createContext, createMemo, JSX, ParentProps, splitProps, useContext } from 'solid-js';

import { applyTheme, genScheme, hasTheme, Theme } from '@/base';
import { use } from './context';

const themeContext = createContext<Theme>({ scheme: genScheme(10), contrast: 'nopreference', mode: 'system' });

/**
 * 返回主题设置的参数
 */
export function useTheme(): Theme {
    const ctx = useContext(themeContext);
    if (!ctx) {
        const [, , o] = use();
        return { scheme: o.scheme, contrast: o.contrast, mode: o.mode };
    }
    return ctx;
}

/**
 * 指定一个新的主题对象，未指定的参数从父类继承。
 *
 * NOTE: 对于非 HTMLElement 的 props.children 将不启作用。
 */
export function ThemeProvider(props: ParentProps<Theme>): JSX.Element {
    const [_, p] = splitProps(props, ['children']);

    const child = createMemo(() => {
        const list = children(() => props.children).toArray();
        list.forEach((item) => {
            // 当两个 ThemeProvider 成包含关系时，子类会先于父类调用，所以要判断每个元素是不是已经设置了主题值。
            if (item && (item instanceof HTMLElement) && !hasTheme(item)) {
                applyTheme(item, p);
            }
        });
        return list;
    });

    return <themeContext.Provider value={p}>{child()}</themeContext.Provider>;
}
