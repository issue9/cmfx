// SPDX-FileCopyrightText: 2026 caixw
//
// SPDX-License-Identifier: MIT

import { createSignal } from 'solid-js';

export const modes = ['system', 'dark', 'light'] as const;

/**
 * 主题模式，可用的取值为 {@link modes}
 */
export type Mode = (typeof modes)[number];

export const modeValues: ReadonlyMap<Mode, string> = new Map<Mode, string>([
	['system', 'light dark'],
	['dark', 'dark'],
	['light', 'light'],
]);

/**
 * 切换主题模式
 */
export function changeMode(elem: HTMLElement, mode?: Mode) {
	if (mode) {
		elem.style.setProperty('color-scheme', modeValues.get(mode)!);
	}
}

const modeWatcher = window.matchMedia('(prefers-color-scheme: dark)');

/**
 * 计算 {@link Mode} 的实际值
 *
 * @remarks
 * 当 {@link Mode} 的值为 system 时，可通过此方法计算 system 代表的实际值。
 *
 * NOTE: 这是一次性的计算，如果需要实时监视，要通过 {@link systemMode} 监视。
 */
export function actualMode(mode: Mode): Omit<Mode, 'system'> {
	if (mode !== 'system') {
		return mode;
	}
	return modeWatcher.matches ? 'dark' : 'light';
}

const [systemMode, setSystemMode] = createSignal<Omit<Mode, 'system'>>(modeWatcher.matches ? 'dark' : 'light');

modeWatcher.addEventListener('change', e => setSystemMode(e.matches ? 'dark' : 'light'));

export { systemMode };
