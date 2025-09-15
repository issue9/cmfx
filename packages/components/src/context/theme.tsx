// SPDX-FileCopyrightText: 2025 caixw
//
// SPDX-License-Identifier: MIT

import { children, createContext, createEffect, For, JSX, ParentProps, splitProps, useContext } from 'solid-js';

import { changeMode, changeScheme, Mode, Scheme } from '@/base';

const themeContext = createContext<Theme>({});

/**
 * 返回主题设置的参数
 */
export function useTheme(): Theme {
    const ctx = useContext(themeContext);
    if (!ctx) {
        throw new Error('主题的上下文环境还未初始化');
    }
    return ctx;
}

export type Props = ParentProps<{
    /**
     * 主题配置
     *
     * @remarks 如果是 string 类型，则从 {@link Options.schemes} 查找同名的，
     * 如果是 {@link Scheme} 类型则表示直接应用该主题。
     *
     * @reactive
     */
    scheme?: Scheme;

    /**
     * 主题的模式
     *
     * @reactive
     */
    mode?: Mode;

    /**
     * 指定用于保存当前主题样式的元素 ID
     *
     * @remarks 当指定了该值，会将主题的样式写在此元素上。否则样式会依次写在 {@link children} 元素上。
     * 某些情况下可能存在一个无任何展示内容的父元素，此时可以指定其作为保存主题样式的元素。
     */
    styleElement?: HTMLElement;
}>;

/**
 * 指定一个新的主题对象，未指定的参数从父类继承。
 *
 * NOTE: 如果 {@link Props.children} 不是 HTMLElement 类型，将不启作用。
 */
export function ThemeProvider(props: Props): JSX.Element {
    const [, theme] = splitProps(props, ['children']);

    if (props.styleElement) {
        createEffect(() => {
            applyTheme(props.styleElement!, theme);
        });
        return <themeContext.Provider value={theme}>{props.children}</themeContext.Provider>;
    }

    // 保存着用于改变主题的函数列表，当 theme 发生变化时，会自动调用这些函数。
    let list: Array<{ (t: Theme): void; }> = [];
    createEffect(() => {
        list.forEach(fn => fn(theme));
    });

    return <themeContext.Provider value={theme}>
        <For each={children(() => props.children).toArray()}>
            {(item, index) => {
                if (index() === 0) { // chindren 发生了变化，重置 list
                    list = [];
                }
                // 当两个 ThemeProvider 成包含关系时，子类会先于父类调用，所以要判断每个元素是不是已经设置了主题值。
                if (item && (item instanceof HTMLElement) && !hasTheme(item)) {
                    list.push(t => applyTheme(item, t));
                }
                return <>{item}</>;
            }}
        </For>
    </themeContext.Provider>;
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
    /**
     * 当前主题的样式
     */
    scheme?: Scheme;

    /**
     * 主题的模式
     */
    mode?: Mode;
}
