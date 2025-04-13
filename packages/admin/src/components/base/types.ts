// SPDX-FileCopyrightText: 2024 caixw
//
// SPDX-License-Identifier: MIT


import { Scheme } from '@/core';

/**
 * 组件可用的几种色盘
 *
 * 当为组件指定一个色盘时，并不是直接改变相应在的颜色，而是在该组件上指定相应在的颜色变量，
 * 具体可参考 /core/theme/theme.css 中的 palette--primary 等相关的定义。
 */
export const palettes: Array<Palette> = ['primary' , 'secondary' , 'tertiary' , 'error', 'surface'] as const;
// TODO 有什么办法可以直接将 Scheme 的所有字段名转换为数组？

export type Palette = keyof Scheme;

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
