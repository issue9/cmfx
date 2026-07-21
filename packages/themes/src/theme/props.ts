// SPDX-FileCopyrightText: 2024-2026 caixw
//
// SPDX-License-Identifier: MIT

import type { JSX } from 'solid-js';

import type { Palette } from './palette';

export interface StyleProps {
	/**
	 * 为组件的根元素指定 CSS 类名
	 *
	 * @remarks
	 * 为当前组件的根元素指定 CSS 类名。该值始终是最后添加到元素的 class 属性上的，
	 * 以保证此类能启作用，当然也有可能会修改组件的定义的一些 CSS 样式。
	 *
	 * @reactive
	 */
	class?: string;

	/**
	 * 组件根元素的样式
	 *
	 * @remarks
	 * 相对于 {@link class}，一些简短的样式设置，直接使用此属性更方便，
	 * 还有一些自定义的样式变量也可以使用此属性设置。
	 *
	 * @reactive
	 */
	style?: JSX.DOMAttributes<HTMLElement>['style'];
}

/**
 * 组件支持主题需要实现的属性
 *
 * @remarks
 * 组件库的所有组件都继承了此接口，以实现统一的样式管理。
 */
export interface ThemeProps extends StyleProps {
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
}

/**
 * 将 solidjs 中的 classList 内容转换为 class 属性
 *
 * @param palette - 颜色主题；
 * @param list - 组件的 classList 对象；
 * @param cls - CSS 类名列表；
 * @returns 由参数组合的 class 属性值；
 */
export function classList(
	palette?: Palette,
	list?: JSX.CustomAttributes<HTMLElement>['classList'],
	...cls: Array<string | undefined | null>
): string | undefined {
	if (!list) {
		return joinClass(palette, ...cls);
	}

	const entries = Object.entries(list);
	if (entries.length === 0) {
		return joinClass(palette, ...cls);
	}

	return joinClass(palette, ...entries.map(item => (item[1] ? item[0] : undefined)), ...cls);
}

/**
 * 将多个 CSS 的类名组合成 class 属性值
 *
 * @param palette - 色盘；
 * @param cls - CSS 类名列表；
 * @returns 由参数组合的 class 属性值；
 */
export function joinClass(palette?: Palette, ...cls: Array<string | undefined | null>): string | undefined {
	if (cls.length > 0) {
		cls = cls.filter(v => v !== undefined && v !== '' && v !== null);
	}

	return cls && cls.length > 0
		? (palette ? `palette--${palette} ` : '') + cls.join(' ')
		: palette
			? `palette--${palette}`
			: undefined;
}

/**
 * 将 solidjs 的 style 组件属性转换为字符串
 *
 * @param style - 符合 solidjs 中的 style 属性的值列表；
 */
export function style2String(...style: Array<ThemeProps['style']>): string {
	if (style.length === 0) {
		return '';
	}

	let ret = '';

	for (const s of style) {
		if (!s) {
			continue;
		}

		if (typeof s !== 'string') {
			Object.entries(s).forEach(([key, value]) => {
				if (value === undefined || value === null) {
					return;
				}

				const cssKey = key.replace(/[A-Z]/g, m => `-${m.toLowerCase()}`); // 驼峰转连字符
				if (typeof value === 'number') {
					ret += `${cssKey}:${value}px;`;
				} else {
					ret += `${cssKey}:${value};`;
				}
			});
		} else {
			ret += `${s};`;
		}
	}

	return ret;
}
