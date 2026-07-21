// SPDX-FileCopyrightText: 2026 caixw
//
// SPDX-License-Identifier: MIT

export const palettes = ['primary', 'secondary', 'tertiary', 'error', 'surface'] as const;

/**
 * 组件可用的几种色盘
 *
 * @remarks 当为组件指定一个色盘时，并不是直接改变相应在的颜色，而是在该组件上指定相应在的颜色变量，
 * 具体可参考 /tailwind.css 中的 `palette--primary` 等相关的定义。
 */
export type Palette = (typeof palettes)[number];

/**
 * 获取当前元素所属的色盘
 * @param elem - 查询的元素；
 * @param next - 如果指定了该值，则表示当前色盘往后移动的数量；
 */
export function palette(elem: HTMLElement, next: number = 0): Palette | undefined {
	const style = window.getComputedStyle(elem);
	const name = style.getPropertyValue('--palette-name').slice(1,-1) as Palette;
	let index = palettes.indexOf(name) + next;
	index = index >= palettes.length ? index % palettes.length : index;
	return palettes[index];
}
