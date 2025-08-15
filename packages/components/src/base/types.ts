// SPDX-FileCopyrightText: 2024-2025 caixw
//
// SPDX-License-Identifier: MIT

import { Palette } from './theme';

export const layouts = ['horizontal', 'vertical'] as const;

/**
 * 组件布局方向
 */
export type Layout = typeof layouts[number];

/**
 * 组件的基本属性
 *
 * @remarks
 * 组件库的所有组件都继承了此接口，以实现统一的样式管理。
 */
export interface Props {
    /**
     * 指定当前组件采用的色盘
     *
     * @remarks
     * 如果指定了此值，那么在组件内部的 CSS 引用的诸如 `--bg` 等 CSS 变量都将使用此色盘对应的颜色。
     * 如果是 undefined，则表示从父元素继承。
     *
     * @reactive
     */
    palette?: Palette;

    /**
     * 为组件的根元素指定 CSS 类名
     *
     * @remarks
     * 为当前组件的根元素指定 CSS 类名。该值始终是最后添加到元素的 calss 属性上的，
     * 以保证此类能启作用，当然也有可能会修改组件的定义的一些 CSS 样式。
     *
     * @defaultValue undefined
     * @reactive
     */
    class?: string;
}
