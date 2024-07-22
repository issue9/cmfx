// SPDX-FileCopyrightText: 2024 caixw
//
// SPDX-License-Identifier: MIT

import { JSX } from 'solid-js';

/**
 * 组件可用的几种色盘
 *
 * 当为组件指定一个色盘时，并不是直接改变相应在的颜色，而是在该组件上指定相应在的颜色变量，
 * 具体可参考 /core/theme/theme.css 中的 palette--primary 等相关的定义。
 */
export const palettes = ['primary' , 'secondary' , 'tertiary' , 'error', 'surface'] as const;

export type Palette = typeof palettes[number];

/**
 * 组件的四个角
 */
export const corners = ['topleft', 'topright', 'bottomleft', 'bottomright'] as const;

export type Corner = typeof corners[number];

/**
 * 所有组件的基本属性
 */
export interface Props {
    /**
     * 指定当前组件采用的色盘
     *
     * 如果是 undefined，则表示从父元素继承。
     */
    palette?: Palette;
}

/**
 * 当组件除 children 之外还需要以 {@link JSX.Element} 作为其属性时，可以声明为此类型。
 * 相比纯粹的 JSX.Element 类型，添加以函数的形式返回 JSX.Element。
 */
export type ElementProp = JSX.Element | {(): JSX.Element};

export function renderElementProp(p?: ElementProp): JSX.Element {
    if (typeof p === 'function') {
        return p();
    }
    return p;
}
