// SPDX-FileCopyrightText: 2026 caixw
//
// SPDX-License-Identifier: MIT

import type { Mode } from '@components/base';

export const modeValues: ReadonlyMap<Mode, string> = new Map<Mode, string>([
	['system', 'light dark'],
	['dark', 'dark'],
	['light', 'light'],
]);

/**
 * 切换主题模式
 */
export function changeMode(elem: HTMLElement, mode?: Mode) {
	if (!mode) {
		return;
	}
	elem.style.setProperty('color-scheme', modeValues.get(mode)!);
}
