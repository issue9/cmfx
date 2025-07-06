// SPDX-FileCopyrightText: 2025 caixw
//
// SPDX-License-Identifier: MIT

import { children, createContext, createMemo, JSX, ParentProps, splitProps, useContext } from 'solid-js';

import { changeMode, changeScheme, Mode, Scheme } from '@/base';
import { use } from './context';

const themeContext = createContext<Theme>({});

/**
 * 返回主题设置的参数
 */
export function useTheme(): Theme {
    const ctx = useContext(themeContext);
    if (!ctx) {
        const [, , o] = use();
        return {
            scheme: (typeof o.scheme === 'string') ? o.schemes!.get(o.scheme) : o.scheme,
            mode: o.mode
        };
    }
    return ctx;
}

/**
 * 指定一个新的主题对象，未指定的参数从父类继承。
 *
 * NOTE: 对于非 HTMLElement 的 props.children 将不启作用。
 */
export function ThemeProvider(props: ParentProps<Theme>): JSX.Element {
    const [_, theme] = splitProps(props, ['children']);

    const child = createMemo(() => {
        const list = children(() => props.children).toArray();
        list.forEach((item) => {
            // 当两个 ThemeProvider 成包含关系时，子类会先于父类调用，所以要判断每个元素是不是已经设置了主题值。
            if (item && (item instanceof HTMLElement) && !hasTheme(item)) {
                applyTheme(item, theme);
            }
        });
        return list;
    });

    return <themeContext.Provider value={theme}>{child()}</themeContext.Provider>;
}


/**
 * 将主题 t 应用到元素 elem
 */
export function applyTheme(elem: HTMLElement, t: Theme) {
    elem.setAttribute('data-theme', '1');
    changeScheme(elem, t.scheme);
    changeMode(elem, t.mode);
}

/**
 * 判断元素 elem 上是否被应用了主题
 */
export function hasTheme(elem: HTMLElement): boolean {
    return elem.hasAttribute('data-theme');
}

/**
 * 提供与主题相关的接口
 */
export interface Theme {
    scheme?: Scheme;
    mode?: Mode;
}
