// SPDX-FileCopyrightText: 2024 caixw
//
// SPDX-License-Identifier: MIT

import type { PresetsConfig } from 'tailwindcss/types/config';

const config: PresetsConfig = {
    theme: {
        backgroundColor: ({theme}) => ({
            'primary': 'var(--primary-bg)',
            'secondary': 'var(--primary-bg)',
            'tertiary': 'var(--tertiary-bg)',
            'surface': 'var(--surface-bg)',
            'error': 'var(--error-bg)',
            ...theme('colors')
        }),

        accentColor: ({theme}) => ({
            'primary': 'var(--primary-bg-high)',
            'secondary': 'var(--secondary-bg-high)',
            'tertiary': 'var(--tertiary-bg-high)',
            'surface': 'var(--surface-bg-high)',
            'error': 'var(--error-bg-high)',
            ...theme('colors')
        }),

        textDecorationColor: ({theme}) => ({
            'primary': 'var(--primary-text-high)',
            'secondary': 'var(--secondary-text-high)',
            'tertiary': 'var(--tertiary-text-high)',
            'surface': 'var(--surface-text-high)',
            'error': 'var(--error-text-high)',
            ...theme('colors')
        }),
        textColor: ({theme}) => ({
            'primary': 'var(--primary-text)',
            'secondary': 'var(--secondary-text)',
            'tertiary': 'var(--tertiary-text)',
            'surface': 'var(--surface-text)',
            'error': 'var(--error-text)',
            ...theme('colors')
        }),
        caretColor: ({theme}) => ({ // 插入符
            'primary': 'var(--primary-text)',
            'secondary': 'var(--secondary-text)',
            'tertiary': 'var(--tertiary-text)',
            'surface': 'var(--surface-text)',
            'error': 'var(--error-text)',
            ...theme('colors')
        }),

        outlineColor: ({theme}) => ({
            'primary': 'var(--primary-bg)',
            'secondary': 'var(--secondary-bg)',
            'tertiary': 'var(--tertiary-bg)',
            'surface': 'var(--surface-bg)',
            'error': 'var(--error-bg)',
            ...theme('colors')
        }),
        borderColor: ({theme}) => ({
            'primary': 'var(--primary-bg)',
            'secondary': 'var(--secondary-bg)',
            'tertiary': 'var(--tertiary-bg)',
            'surface': 'var(--surface-bg)',
            'error': 'var(--error-bg)',
            ...theme('colors')
        }),
        placeholderColor: ({theme})=>({
            'primary': 'var(--primary-text-low)',
            'secondary': 'var(--secondary-text-low)',
            'tertiary': 'var(--tertiary-text-low)',
            'surface': 'var(--surface-text-low)',
            'error': 'var(--error-text-low)',
            ...theme('colors')
        }),

        divideColor: ({theme}) => ({
            'primary': 'var(--primary-bg-low)',
            'secondary': 'var(--secondary-bg-low)',
            'tertiary': 'var(--tertiary-bg-low)',
            'surface': 'var(--surface-bg-low)',
            'error': 'var(--error-bg-low)',
            ...theme('colors')
        })
    }
};

export default config;
