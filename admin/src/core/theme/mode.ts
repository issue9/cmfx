// SPDX-FileCopyrightText: 2024 caixw
//
// SPDX-License-Identifier: MIT

export const modes = ['system', 'dark', 'light'] as const;

const key = 'theme_mode';

const dark = window.matchMedia('(prefers-color-scheme: dark)');

/**
 * 主题模式，可用的取值为 {@link modes}
 */
export type Mode = typeof modes[number];

/**
 * 初始化当前系统的主题
 *
 * @param preset 如果未指定主题模式，则采用此值。
 */
export function initMode(preset: Mode) {
    let m = (localStorage.getItem(key) ?? preset) as Mode;
    if (modes.indexOf(m) < 0) {
        console.log(`从 localStorage 读取的 ${key} 值 ${m} 不符合要求！`);
        m = 'system';
    }
    changeMode(m);
}

/**
 * 切换主题模式
 *
 * NOTE: 主题模式会记录在当前浏览器环境，下次启动时会自动读取。
 */
export function changeMode(mode: Mode) {
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

    localStorage.setItem(key, mode);
}

function systemMode(e: MediaQueryListEvent) {
    setDarkMode(e.matches);
}

function setDarkMode(dark?: boolean) {
    if (dark) {
        document.documentElement.classList.add('dark');
        return;
    }
    document.documentElement.classList.remove('dark');
}
