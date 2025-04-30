// SPDX-FileCopyrightText: 2025 caixw
//
// SPDX-License-Identifier: MIT

import { Contrast, Mode, Scheme, Theme } from '@cmfx/core';
import { children, createContext, JSX, ParentProps, splitProps, useContext } from 'solid-js';

export interface Props {
    scheme?: Scheme | number;
    contrast?: Contrast;
    mode?: Mode;
};

const themeContext = createContext<Props>({ scheme: Theme.genScheme(10), contrast: 'nopreference', mode: 'system' });

/**
 * 返回主题设置的参数
 */
export function useTheme(): Props {
    const ctx = useContext(themeContext);
    if (!ctx) {
        throw '未找到正确的 themeContext';
    }
    return ctx;
}

/**
 * 指定一个新的主题对象，未指定的参数从父类继承。
 */
export function ThemeProvider(props: ParentProps<Props>): JSX.Element {
    const list = children(() => props.children).toArray();
    list.forEach((item) => {
        // 当两个 ThemeProvider 成包含关系时，子类会先于父类调用，所以要判断每个元素是不是已经设置了主题值。
        if (item && (item instanceof HTMLElement) && !Theme.hasTheme(item)) {
            Theme.apply(item, new Theme(props.scheme, props.mode, props.contrast));
        }
    });
    const [_, p] = splitProps(props, ['children']);

    return <themeContext.Provider value={p}>{list}</themeContext.Provider>;
}