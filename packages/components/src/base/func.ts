// SPDX-FileCopyrightText: 2024-2026 caixw
//
// SPDX-License-Identifier: MIT

import { JSX } from 'solid-js';

import { Palette } from './theme';
import { Props } from './types';

/**
 * 复制整个 {@link JSX#Element} 元素
 *
 * NOTE: 仅复制元素，对于响应方式可能并不会有效果。
 */
export function cloneElement(e: JSX.Element): JSX.Element {
	if (e instanceof Node) {
		return e.cloneNode(true);
	} else if (Array.isArray(e)) {
		return e.map(e => cloneElement(e));
	} else {
		// 其它的均为普通类型，直接返回。
		return e;
	}
}

/**
 * 处理事件
 *
 * solidjs 可以处理像 `onClick={[handler, item.id]}` 这种非标准的事件类型，
 * 此方法用于将非标准模式下的方法转换为标准的事件行为。
 *
 * NOTE: 并不是所有的事件都是 {@link JSX#EventHandlerUnion} 类型的，
 * 但是都大同小异，其它的类型可根据此方法自行处理。
 */
export function handleEvent<T, E extends Event>(
	h: JSX.EventHandlerUnion<T, E>,
	e: Parameters<JSX.EventHandler<T, E>>[0],
) {
	if (typeof h === 'function') {
		h(e);
	} else {
		h[0](h[1], e);
	}
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
 * @param palette - 颜色主题；
 * @param cls - CSS 类名列表；
 * @returns 由参数组合的 class 属性值；
 */
export function joinClass(palette?: Palette, ...cls: Array<string | undefined | null>): string | undefined {
	if (cls) {
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
export function style2String(...style: Array<Props['style']>): string {
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
