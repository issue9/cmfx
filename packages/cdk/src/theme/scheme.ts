// SPDX-FileCopyrightText: 2024-2026 caixw
//
// SPDX-License-Identifier: MIT

import { type Palette, palettes } from './palette';

export const breakpoints = ['3xs', 'xs', 'sm', 'md', 'lg', '2xl', '4xl', '6xl', '8xl'] as const;

/**
 * 容器查询能用的类型
 *
 * @remarks
 * 不建议使用 @media (width>500) 等基于浏览器宽度的媒体查询。
 * 而是使用最新的容器查询。
 */
export type Breakpoint = (typeof breakpoints)[number];

/**
 * 定义主题相关的各类变量
 */
export type Scheme = Record<Palette, string> & {
	// NOTE: 主题颜色值是必须要全部定义，不能从父元素继承。
	// 否则可能出现当前的 primary 与父类的 secondary 相同的情况。

	/**
	 * 各种不同大小的组件的圆角设置
	 */
	radius: Radius;

	/**
	 * 其它的 CSS 变量
	 */
	vars?: Record<`--${string}`, string>;
};

const radius = ['xs', 'sm', 'md', 'lg', 'xl'] as const;

/**
 * 圆角参数的设置
 *
 * @remarks
 * 属性名表示的是组件的大小。单位为 rem。
 */
export type Radius = Record<(typeof radius)[number], number>;

// 非自定义变量的名称前缀
const noVarPrefix = [
	...radius.map(v => `--radius-${v}`), // --radius-xs 等
	...palettes.map(v => `--${v}`), // --primary 等

	'--palette-',
	'--default-transition-duration',
] as const;

/**
 * 从 elem 上读取当前的主题配置
 *
 * @param elem - 要读取的元素。默认为 document.documentElement；
 */
export function readScheme(elem: HTMLElement = document.documentElement): Scheme {
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

	const vars: Scheme['vars'] = {};
	for (let i = 0; i < elem.style.length; i++) {
		const name = elem.style.item(i);
		if (name?.startsWith('--') && noVarPrefix.every(n => !name.startsWith(n))) {
			vars[name as keyof Scheme['vars']] = elem.style.getPropertyValue(name);
		}
	}

	return {
		primary: elem.style.getPropertyValue('--primary'),
		secondary: elem.style.getPropertyValue('--secondary'),
		tertiary: elem.style.getPropertyValue('--tertiary'),
		error: elem.style.getPropertyValue('--error'),
		surface: elem.style.getPropertyValue('--surface'),
		radius,
		vars,
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

	if (s.vars) {
		Object.entries(s.vars).forEach(([k2, v2]) => {
			if (v2 !== undefined) {
				elem.style.setProperty(k2, v2);
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
			if (rule instanceof CSSStyleRule && rule.selectorText === ':root') {
				for (const r of rule.cssRules) {
					// 如果当前浏览器支持 @supports，则采用 @supports 的内容作为值。
					// https://github.com/issue9/cmfx/issues/17
					if (r instanceof CSSSupportsRule && CSS.supports(r.conditionText)) {
						for (const cr of Array.from(r.cssRules)) {
							const styles = cr.cssText.split(';').filter(v => v.length > 0);
							for (const s of styles) {
								const [key, val] = s.split(':');
								elem.style.setProperty(key, val);
							}
						}
					}
				}

				for (let i = 0; i < rule.style.length; i++) {
					const key = rule.style.item(i);
					if (!key.startsWith('--') || noVarPrefix.every(p => !key.startsWith(p))) {
						continue;
					}

					// 如果已经存在，说明当前主题中有定义，不需要复制。
					if (!elem.style.getPropertyValue(key)) {
						elem.style.setProperty(key, rule.style.getPropertyValue(key));
					}
				}
			}
		}
	}
}
