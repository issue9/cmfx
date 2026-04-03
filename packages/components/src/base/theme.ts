// SPDX-FileCopyrightText: 2024-2026 caixw
//
// SPDX-License-Identifier: MIT

export const modes = ['system', 'dark', 'light'] as const;

/**
 * 主题模式，可用的取值为 {@link modes}
 */
export type Mode = (typeof modes)[number];

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

export const palettes = ['primary', 'secondary', 'tertiary', 'error', 'surface'] as const;

/**
 * 组件可用的几种色盘
 *
 * @remarks 当为组件指定一个色盘时，并不是直接改变相应在的颜色，而是在该组件上指定相应在的颜色变量，
 * 具体可参考 /tailwind.css 中的 `palette--primary` 等相关的定义。
 */
export type Palette = (typeof palettes)[number];
