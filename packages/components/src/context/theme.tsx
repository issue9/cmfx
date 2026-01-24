// SPDX-FileCopyrightText: 2025-2026 caixw
//
// SPDX-License-Identifier: MIT

import {
    children, createContext, createEffect, createMemo, For, JSX, ParentProps, splitProps, useContext
} from 'solid-js';

import { changeMode, Mode, Scheme, writeScheme } from '@components/base';
import { useOptions } from './context';
import { ContextNotFoundError } from './errors';

const themeContext = createContext<Omit<Props, 'children'>>();

/**
 * 提供与主题相关的接口
 */
export interface Theme {
    /**
     * 当前主题的样式
     */
    scheme: Scheme;

    /**
     * 主题的模式
     */
    mode: Mode;
}

/**
 * 返回主题设置的参数
 */
export function useTheme(): Theme {
    const ctx = useContext(themeContext);
    if (!ctx) { throw new ContextNotFoundError('themeContext'); }
    return createTheme(ctx);
}

type OptionalTheme = Partial<Theme>;

export type Props = ParentProps<OptionalTheme & {
    /**
     * 指定用于保存当前主题样式的元素 ID
     *
     * @remarks
     * 当指定了该值，会将主题的样式写在此元素上。否则样式会依次写在 {@link children} 元素上。
     * 某些情况下可能存在一个无任何展示内容的父元素，此时可以指定其作为保存主题样式的元素。
     */
    styleElement?: HTMLElement;

    /**
     * 上一层 ThemeProvider 的属性值
     */
    p?: Props;
}>;

/**
 * 指定一个新的主题对象
 *
 * @remarks
 * 除去 children 之外的可选属性，如果未指定，会尝试向上一层的 `<ThemeProvider>` 组件查找对应的值。
 *
 * 如果 {@link Props#children} 不是 HTMLElement 类型，将不启作用。
 * 只对被包含的元素起作用，如果是通过 Protal 将元素放到外层的，不会启作用，比如 notify 的通知框。
 */
export function ThemeProvider(props: Omit<Props, 'p'>): JSX.Element {
    let [, theme] = splitProps(props, ['children']);
    (theme as Props).p = useContext(themeContext);

    if (props.styleElement) {
        createEffect(() => {
            applyTheme(props.styleElement!, theme);
        });
        return <themeContext.Provider value={theme}>{props.children}</themeContext.Provider>;
    }

    // 保存着用于改变主题的函数列表，当 theme 发生变化时，会自动调用这些函数。
    let list: Array<{ (t: OptionalTheme): void; }> = [];
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
export function applyTheme(elem: HTMLElement, t: OptionalTheme) {
    elem.setAttribute('data-theme', '1');
    writeScheme(elem, t.scheme);
    changeMode(elem, t.mode);
}

/**
 * 判断元素 elem 上是否被应用了主题
 */
export function hasTheme(elem: HTMLElement): boolean {
    return elem.hasAttribute('data-theme');
}

function createTheme(props: Props): Theme {
    const [accessor] = useOptions();
    const obj = createMemo(() => {
        const p = props.p;
        const os = accessor.getScheme();

        const radius = Object.assign({}, os.radius, p?.scheme?.radius, props.scheme?.radius);
        const scheme = Object.assign({ radius }, os, p?.scheme, props.scheme);
        const ret = Object.assign({}, { mode: accessor.getMode() }, { scheme: os }, { mode: p?.mode, scheme }, props);
        delete ret.p;
        return ret;
    });
    return obj();
}
