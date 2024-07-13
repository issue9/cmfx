// SPDX-FileCopyrightText: 2024 caixw
//
// SPDX-License-Identifier: MIT

/**
 * 表示组件的颜色主题
 *
 * 当为组件指定一个颜色主题时，并不是直接改变相应在的颜色，而是在该组件上指定相应在的颜色变量，
 * 具体可参考 style.css 中的 scheme--primary 等相关的定义。
 */
export const schemes = ['primary' , 'secondary' , 'tertiary' , 'error'] as const;

export type Scheme = typeof schemes[number];

/**
 * 元素的四个角
 */
export const corners = ['topleft', 'topright', 'bottomleft', 'bottomright'] as const;

export type Corner = typeof corners[number];

/**
 * 所有组件的基本属性
 */
export interface Props {
    /**
     * 指定当前组件的主题样式
     *
     * 如果是 undefined，则表示从父元素继承。
     */
    scheme?: Scheme;
}
