// SPDX-FileCopyrightText: 2024-2025 caixw
//
// SPDX-License-Identifier: MIT

import { Config } from '@core/config';

export const modes = ['system', 'dark', 'light'] as const;

/**
 * 主题模式，可用的取值为 {@link modes}
 */
export type Mode = typeof modes[number];

const key = 'theme_mode';

const schemes: ReadonlyMap<Mode, string> = new Map<Mode, string>([
    ['system', 'light dark'],
    ['dark', 'dark'],
    ['light', 'light'],
]);

/**
 * 从当前的配置项中找到关于主题模式的配置项。
 *
 * @param c 保存配置项的接口；
 * @param preset 如果未指定主题模式，则采用此值；
 */
export function getMode(c: Config, preset: Mode) {
    let m = c.get<Mode>(key);
    if (!m) {
        m = preset;
    } else if (modes.indexOf(m) < 0) {
        console.warn(`从 c 读取的 ${key} 值 ${m} 不符合要求！`);
        m = 'system';
    }

    return m;
}

/**
 * 切换主题模式
 *
 * NOTE: 主题模式会记录在当前浏览器环境，下次启动时会自动读取。
 */
export function changeMode(c: Config, mode: Mode) {
    document.documentElement.style.setProperty('color-scheme', schemes.get(mode)!);
    c.set(key, mode);
}
