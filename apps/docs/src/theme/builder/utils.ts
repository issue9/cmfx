// SPDX-FileCopyrightText: 2025-2026 caixw
//
// SPDX-License-Identifier: MIT

import { palettes, Scheme } from '@cmfx/components';

/**
 * 将参数 s 中的颜色变量转换为实际颜色值
 */
export function convertSchemeVar2Color(s: Scheme): Scheme {
	// 主题无法引用非全局的 CSS 变量。所以这里统一从全局解析变量的值
	const style = window.getComputedStyle(document.documentElement);

	for (const p of palettes) {
		const colorVal = s[p];
		if (colorVal.startsWith('var(--')) {
			// 值是变量，需要计算其真实的值。
			s[p] = style.getPropertyValue(colorVal.slice(4, -1));
		}
	}

	return s;
}
