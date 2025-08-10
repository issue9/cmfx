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
 * 所有组件的基本属性
 */
export interface Props {
    /**
     * 指定当前组件采用的色盘
     *
     * 如果是 undefined，则表示从父元素继承。
     */
    palette?: Palette;

    /**
     * 为组件的根元素指定 CSS 类名
     */
    class?: string;
}
