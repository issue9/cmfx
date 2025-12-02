// SPDX-FileCopyrightText: 2024-2025 caixw
//
// SPDX-License-Identifier: MIT

export const modes = ['system', 'dark', 'light'] as const;

/**
 * 主题模式，可用的取值为 {@link modes}
 */
export type Mode = typeof modes[number];

export const modeValues: ReadonlyMap<Mode, string> = new Map<Mode, string>([
    ['system', 'light dark'],
    ['dark', 'dark'],
    ['light', 'light'],
]);

/**
 * 切换主题模式
 */
export function changeMode(elem: HTMLElement, mode?: Mode) {
    if (!mode) { return; }
    elem.style.setProperty('color-scheme', modeValues.get(mode)!);
}
