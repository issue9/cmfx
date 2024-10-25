// SPDX-FileCopyrightText: 2024 caixw
//
// SPDX-License-Identifier: MIT

import type { PresetsConfig, ScreensConfig } from 'tailwindcss/types/config';
import { breakpoints, breakpointsMedia } from './src/core/theme/breakpoints';

const colors = {
    'primary-bg': 'var(--primary-bg)',
    'primary-bg-low': 'var(--primary-bg-low)',
    'primary-bg-high': 'var(--primary-bg-high)',
    'primary-fg': 'var(--primary-fg)',
    'primary-fg-low': 'var(--primary-fg-low)',
    'primary-fg-high': 'var(--primary-fg-high)',

    'secondary-bg': 'var(--secondary-bg)',
    'secondary-bg-low': 'var(--secondary-bg-low)',
    'secondary-bg-high': 'var(--secondary-bg-high)',
    'secondary-fg': 'var(--secondary-fg)',
    'secondary-fg-low': 'var(--secondary-fg-low)',
    'secondary-fg-high': 'var(--secondary-fg-high)',

    'tertiary-bg': 'var(--tertiary-bg)',
    'tertiary-bg-low': 'var(--tertiary-bg-low)',
    'tertiary-bg-high': 'var(--tertiary-bg-high)',
    'tertiary-fg': 'var(--tertiary-fg)',
    'tertiary-fg-low': 'var(--tertiary-fg-low)',
    'tertiary-fg-high': 'var(--tertiary-fg-high)',

    'error-bg': 'var(--error-bg)',
    'error-bg-low': 'var(--error-bg-low)',
    'error-bg-high': 'var(--error-bg-high)',
    'error-fg': 'var(--error-fg)',
    'error-fg-low': 'var(--error-fg-low)',
    'error-fg-high': 'var(--error-fg-high)',

    'surface-bg': 'var(--surface-bg)',
    'surface-bg-low': 'var(--surface-bg-low)',
    'surface-bg-high': 'var(--surface-bg-high)',
    'surface-fg': 'var(--surface-fg)',
    'surface-fg-low': 'var(--surface-fg-low)',
    'surface-fg-high': 'var(--surface-fg-high)',

    'palette-bg': 'var(--bg)',
    'palette-bg-low': 'var(--bg-low)',
    'palette-bg-high': 'var(--bg-high)',
    'palette-fg': 'var(--fg)',
    'palette-fg-low': 'var(--fg-low)',
    'palette-fg-high': 'var(--fg-high)',
} as const;

const config: PresetsConfig = {
    darkMode: 'selector',

    theme: {
        // 重定义 screens 属性，而不是扩展。
        screens: buildScreens(),

        extend: {
            backgroundColor: colors,

            textColor: colors,
            placeholderColor: colors,
            caretColor: colors,
            textDecorationColor: colors,

            accentColor: colors,

            borderColor: colors,
            outlineColor: colors,
            ringColor: colors,
            divideColor: colors,
            boxShadowColor: colors,

            minWidth: breakpoints,
            maxWidth: breakpoints,
        }
    }
};

function buildScreens() {
    const screens: ScreensConfig  = {};
    Object.entries(breakpointsMedia).forEach((item) => {
        // NOTE: 当屏幕从大到小变化，比如从 sm 向 xs 变化，会触发 sm 事件，且其 matches 为 false，
        // 但是不会触发 xs，因为 sm 本身也是符合 xs 的条件。
        screens[item[0]] = { 'raw': item[1]};
    });
    return screens;
}

export default config;
