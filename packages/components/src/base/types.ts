// SPDX-FileCopyrightText: 2024-2026 caixw
//
// SPDX-License-Identifier: MIT

import { JSX } from 'solid-js';

import { Palette } from './theme';

export const layouts = ['horizontal', 'vertical'] as const;

/**
 * 组件布局方向
 */
export type Layout = (typeof layouts)[number];

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
	 * 如果指定了此值，那么在组件内部的 CSS 引用的诸如 `--palette-bg` 等 CSS 变量都将使用此色盘对应的颜色。
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
	 * @reactive
	 */
	class?: string;

	/**
	 * 组件根元素的样式
	 *
	 * @remarks
	 * 相对于 {@link Props."class"}，一些简短的样式设置，直接使用此属性更方便，
	 * 还有一些自定义的样式变量也可以使用此属性设置。
	 *
	 * @reactive
	 */
	style?: JSX.DOMAttributes<HTMLElement>['style'];
}

/**
 * 用于指定组件的 ref 属性
 *
 * @typeParam REF - Ref 对象类型；
 */
export interface RefProps<REF> {
	/**
	 * 对当前组件的一些次要操作可能会通过此方法给出
	 */
	ref?: (m: REF) => void;
}

/**
 * 为 Portal 组件指定的挂载属性
 */
export interface MountProps {
	/**
	 * 为 Portal 指定挂载位置
	 */
	mount?: Node;
}
