// SPDX-FileCopyrightText: 2024-2026 caixw
//
// SPDX-License-Identifier: MIT

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
export type Scheme = {
	// NOTE: 主题颜色值是必须要全部定义，不能从父元素继承。
	// 否则可能出现当前的 primary 与父类的 secondary 相同的情况。

	primary: string;
	secondary: string;
	tertiary: string;

	/**
	 * 表示错误信息
	 */
	error: string;

	/**
	 * 一般用于大面积的背景色
	 */
	surface: string;

	/**
	 * 各种不同大小的组件的圆角设置
	 */
	radius: Radius;

	/**
	 * 其它的 CSS 变量
	 */
	vars?: Record<`--${string}`, string>;
};

/**
 * 圆角参数的设置
 *
 * @remarks
 * 属性名表示的是组件的大小。单位为 rem。
 */
export type Radius = {
	xs: number;
	sm: number;
	md: number;
	lg: number;
	xl: number;
};

// 非自定义变量的名称前缀
const noVarPrefix = [
	'--radius-xs',
	'--radius-sm',
	'--radius-md',
	'--radius-lg',
	'--radius-xl',

	'--primary',
	'--secondary',
	'--tertiary',
	'--error',
	'--surface',

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
			if (rule instanceof CSSStyleRule) {
				if (rule.selectorText === ':root') {
					Object.entries(rule.style).forEach(([_, key]) => {
						if (!key.startsWith('--') || noVarPrefix.every(p => !key.startsWith(p))) {
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
