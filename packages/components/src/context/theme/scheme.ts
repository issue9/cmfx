// SPDX-FileCopyrightText: 2024-2026 caixw
//
// SPDX-License-Identifier: MIT

import type { Radius, Scheme } from '@components/base';

/**
 * 从 elem 上读取当前的主题配置
 */
export function readScheme(elem?: HTMLElement): Scheme {
	if (!elem) {
		elem = document.documentElement;
	}

	const xs = elem.style.getPropertyValue('--radius-xs');
	const sm = elem.style.getPropertyValue('--radius-sm');
	const md = elem.style.getPropertyValue('--radius-md');
	const lg = elem.style.getPropertyValue('--radius-lg');
	const xl = elem.style.getPropertyValue('--radius-xl');
	const radius: Radius = {
		xs: xs ? parseFloat(xs.slice(0, -3)) : 0,
		sm: sm ? parseFloat(sm.slice(0, -3)) : 0,
		md: md ? parseFloat(md.slice(0, -3)) : 0,
		lg: lg ? parseFloat(lg.slice(0, -3)) : 0,
		xl: xl ? parseFloat(xl.slice(0, -3)) : 0,
	};

	return {
		primary: elem.style.getPropertyValue('--primary'),
		secondary: elem.style.getPropertyValue('--secondary'),
		tertiary: elem.style.getPropertyValue('--tertiary'),
		error: elem.style.getPropertyValue('--error'),
		surface: elem.style.getPropertyValue('--surface'),
		radius,
	};
}

/**
 * 将主题 s 写入 elem
 */
export function writeScheme(elem: HTMLElement, s?: Scheme) {
	if (!s) {
		return;
	}

	if (s.radius) {
		Object.entries(s.radius).forEach(([k2, v2]) => {
			if (v2 !== undefined) {
				elem.style.setProperty(`--radius-${k2}`, `${v2}rem`);
			}
		});
	}

	elem.style.setProperty('--primary', s.primary);
	elem.style.setProperty('--secondary', s.secondary);
	elem.style.setProperty('--tertiary', s.tertiary);
	elem.style.setProperty('--error', s.error);
	elem.style.setProperty('--surface', s.surface);

	// --palette-bg 等变量引用的值 --primary 已经改变。
	// 需要复制这些变量到当前元素，让元素重新计算 --palette-bg 等变量的值。
	for (const sheet of document.styleSheets) {
		for (const rule of sheet.cssRules) {
			if (rule instanceof CSSStyleRule) {
				if (rule.selectorText === ':root') {
					Object.entries(rule.style).forEach(([_, key]) => {
						if (!key.startsWith('--')) {
							return;
						}

						// 如果已经存在，说明当前主题中有定义，不需要复制。
						if (!elem.style.getPropertyValue(key)) {
							elem.style.setProperty(key, rule.style.getPropertyValue(key));
						}
					});
				}
			}
		}
	}
}
