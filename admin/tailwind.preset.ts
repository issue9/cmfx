// SPDX-FileCopyrightText: 2024 caixw
//
// SPDX-License-Identifier: MIT

import type { PluginUtils, PresetsConfig } from 'tailwindcss/types/config';

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

function applyColors(f: PluginUtils['theme']) {
    return {
        ...colors,
        ...f('colors')
    };
}

const config: PresetsConfig = {
    darkMode: 'selector',

    theme: {
        // 自定义颜色，方便直接在 HTML 中使用

        backgroundColor: ({theme})=>({
            ...applyColors(theme)
        }),

        textColor: ({theme})=>({
            ...applyColors(theme)
        }),
        placeholderColor: ({theme})=>({
            ...applyColors(theme)
        }),
        caretColor: ({theme})=>({
            ...applyColors(theme)
        }),
        textDecorationColor: ({theme})=>({
            ...applyColors(theme)
        }),

        accentColor: ({theme})=>({
            ...applyColors(theme)
        }),

        borderColor: ({theme})=>({
            ...applyColors(theme)
        }),
        outlineColor: ({theme})=>({
            ...applyColors(theme)
        }),
        ringColor: ({theme})=>({
            ...applyColors(theme)
        }),

        divideColor: ({theme})=>({
            ...applyColors(theme)
        }),
    }
};

export default config;
