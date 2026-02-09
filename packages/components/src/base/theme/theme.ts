// SPDX-FileCopyrightText: 2024-2026 caixw
//
// SPDX-License-Identifier: MIT

import Color from 'colorjs.io';
import { createSignal } from 'solid-js';

export const breakpoints = ['xs', 'sm', 'md', 'lg', 'xl', '2xl'] as const;

/**
 * 支持的屏幕类型
 */
export type Breakpoint = (typeof breakpoints)[number];

/**
 * 计算两个颜色值之间的 wcag 值
 *
 * @param c1 - 第一个颜色值；
 * @param c2 - 第二个颜色值；
 * @param apca - 是否使用 APCA 算法计算；
 */
export function wcag(c1: string, c2: string, apca?: boolean): string {
	const cc1 = new Color(c1);
	const cc2 = new Color(c2);

	// apca 中正数表示深色文字在浅色背景上，负数表示浅色文字在深色背景上，所以要做绝对值。
	return apca ? Math.abs(cc1.contrastAPCA(cc2)).toFixed(0) : cc1.contrastWCAG21(cc2).toFixed(1);
}

const reducedMotionWatcher = window.matchMedia('(prefers-reduced-motion: reduce)');

const [isReducedMotion, setIsReducedMotion] = createSignal<boolean>(reducedMotionWatcher.matches);

reducedMotionWatcher.addEventListener('change', e => {
	setIsReducedMotion(e.matches);
});

export { isReducedMotion };
