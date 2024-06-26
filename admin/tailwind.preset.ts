// SPDX-FileCopyrightText: 2024 caixw
//
// SPDX-License-Identifier: MIT

import type { PresetsConfig } from 'tailwindcss/types/config';

export default {
    theme: {
        backgroundColor: ({ theme }) => ({
            'primary': 'rgb(var(--primary-bg) / <alpha-value>)',
            'secondary': 'rgb(var(--secondary-bg) / <alpha-value>)',
            'tertiary': 'rgb(var(--tertiary-bg) / <alpha-value>)',
            'surface': 'rgb(var(--surface-bg) / <alpha-value>)',
            'error': 'rgb(var(--error-bg) / <alpha-value>)',
            ...theme('colors')
        }),

        textDecorationColor: ({ theme }) => ({
            'primary': 'rgb(var(--primary-text) / <alpha-value>)',
            'secondary': 'rgb(var(--secondary-text) / <alpha-value>)',
            'tertiary': 'rgb(var(--tertiary-text) / <alpha-value>)',
            'surface': 'rgb(var(--surface-text) / <alpha-value>)',
            'error': 'rgb(var(--error-text) / <alpha-value>)',
            ...theme('colors')
        }),
        textColor: ({ theme }) => ({
            'primary': 'rgb(var(--primary-text) / <alpha-value>)',
            'secondary': 'rgb(var(--secondary-text) / <alpha-value>)',
            'tertiary': 'rgb(var(--tertiary-text) / <alpha-value>)',
            'surface': 'rgb(var(--surface-text) / <alpha-value>)',
            'error': 'rgb(var(--error-text) / <alpha-value>)',
            ...theme('colors')
        }),
        caretColor: ({ theme }) => ({ // 插入符
            'primary': 'rgb(var(--primary-text) / <alpha-value>)',
            'secondary': 'rgb(var(--secondary-text) / <alpha-value>)',
            'tertiary': 'rgb(var(--tertiary-text) / <alpha-value>)',
            'surface': 'rgb(var(--surface-text) / <alpha-value>)',
            'error': 'rgb(var(--error-text) / <alpha-value>)',
            ...theme('colors')
        }),

        ringColor: ({ theme }) => ({
            'primary': 'rgb(var(--primary-outline) / <alpha-value>)',
            'secondary': 'rgb(var(--secondary-outline) / <alpha-value>)',
            'tertiary': 'rgb(var(--tertiary-outline) / <alpha-value>)',
            'surface': 'rgb(var(--surface-outline) / <alpha-value>)',
            'error': 'rgb(var(--error-outline) / <alpha-value>)',
            ...theme('colors')
        }),
        outlineColor: ({ theme }) => ({
            'primary': 'rgb(var(--primary-outline) / <alpha-value>)',
            'secondary': 'rgb(var(--secondary-outline) / <alpha-value>)',
            'tertiary': 'rgb(var(--tertiary-outline) / <alpha-value>)',
            'surface': 'rgb(var(--surface-outline) / <alpha-value>)',
            'error': 'rgb(var(--error-outline) / <alpha-value>)',
            ...theme('colors')
        }),
        borderColor: ({ theme }) => ({
            'primary': 'rgb(var(--primary-outline) / <alpha-value>)',
            'secondary': 'rgb(var(--secondary-outline) / <alpha-value>)',
            'tertiary': 'rgb(var(--tertiary-outline) / <alpha-value>)',
            'surface': 'rgb(var(--surface-outline) / <alpha-value>)',
            'error': 'rgb(var(--error-outline) / <alpha-value>)',
            ...theme('colors')
        }),
        boxShadowColor: ({ theme }) => ({
            'primary': 'rgb(var(--primary-outline) / <alpha-value>)',
            'secondary': 'rgb(var(--secondary-outline) / <alpha-value>)',
            'tertiary': 'rgb(var(--tertiary-outline) / <alpha-value>)',
            'surface': 'rgb(var(--surface-outline) / <alpha-value>)',
            'error': 'rgb(var(--error-outline) / <alpha-value>)',
            ...theme('colors')
        }),

        divideColor: ({ theme }) => ({
            'primary': 'rgb(var(--primary-divider) / <alpha-value>)',
            'secondary': 'rgb(var(--secondary-divider) / <alpha-value>)',
            'tertiary': 'rgb(var(--tertiary-divider) / <alpha-value>)',
            'surface': 'rgb(var(--surface-divider) / <alpha-value>)',
            'error': 'rgb(var(--error-divider) / <alpha-value>)',
            ...theme('colors')
        }),
    }
} satisfies PresetsConfig;
