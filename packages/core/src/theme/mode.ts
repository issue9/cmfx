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
 *
 * NOTE: 主题模式会记录在当前浏览器环境，下次启动时会自动读取。
 */
export function changeMode(elem: HTMLElement, mode: Mode) {
    elem.style.setProperty('color-scheme', modeValues.get(mode)!);
}
