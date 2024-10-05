// SPDX-FileCopyrightText: 2024 caixw
//
// SPDX-License-Identifier: MIT

import { Config } from '@/core/config';

export const modes = ['system', 'dark', 'light'] as const;

const key = 'theme_mode';

const dark = window.matchMedia('(prefers-color-scheme: dark)');

/**
 * 主题模式，可用的取值为 {@link modes}
 */
export type Mode = typeof modes[number];

/**
 * 从当前的配置项中找到关于主题模式的配置项。
 *
 * @param preset 如果未指定主题模式，则采用此值。
 */
export function getMode(c: Config, preset: Mode) {
    let m = c.get<Mode>(key);
    if (!m) {
        m = preset;
    } else if (modes.indexOf(m) < 0) {
        console.log(`从 localStorage 读取的 ${key} 值 ${m} 不符合要求！`);
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
    switch (mode) {
    case 'system':
        setDarkMode(dark.matches);
        dark.addEventListener('change', systemMode);
        break;
    case 'dark':
        setDarkMode(true);
        dark.removeEventListener('change', systemMode);
        break;
    case 'light':
        setDarkMode(false);
        dark.removeEventListener('change', systemMode);
        break;
    }

    c.set(key, mode);
}

function systemMode(e: MediaQueryListEvent) { setDarkMode(e.matches); }

function setDarkMode(dark?: boolean) {
    if (dark) {
        document.documentElement.classList.add('dark');
        return;
    }
    document.documentElement.classList.remove('dark');
}
