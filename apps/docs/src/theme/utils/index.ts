// SPDX-FileCopyrightText: 2025-2026 caixw
//
// SPDX-License-Identifier: MIT

import { palettes, type Scheme } from '@cmfx/themes';
import type { createStore } from 'solid-js/store';

/**
 * 将参数 s 中的颜色变量转换为实际颜色值并返回新的对象
 *
 * @remarks
 * 会对 s 进行 structuredClone，需要注意其中是否包含不可复制元素。
 */
export function convertSchemeVar2Color(s: Scheme): Scheme {
	// 主题无法引用非全局的 CSS 变量。所以这里统一从全局解析变量的值
	const style = window.getComputedStyle(document.documentElement);

	const ret = structuredClone(s);
	if (!ret.vars) {
		ret.vars = {};
	}

	for (const p of palettes) {
		const colorVal = s[p];

		if (colorVal.startsWith('var(--')) {
			// 值是变量，需要计算其真实的值。
			ret[p] = style.getPropertyValue(colorVal.slice(4, -1));
		} else {
			ret[p] = colorVal;
		}
	}

	return ret;
}

export type SchemeStore = ReturnType<typeof createStore<Scheme>>;
