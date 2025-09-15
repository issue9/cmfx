// SPDX-FileCopyrightText: 2025 caixw
//
// SPDX-License-Identifier: MIT

// 采用变量名作为颜色值

import { Scheme } from '@/base';

export default {
    contrast: 60,
    fontSize: '16px',
    dark: {
        'primary-bg-low': 'var(--color-blue-800)',
        'primary-bg': 'var(--color-blue-900)',
        'primary-bg-high': 'var(--color-blue-950)',
        'primary-fg-low': 'var(--color-blue-100)',
        'primary-fg': 'var(--color-blue-300)',
        'primary-fg-high': 'var(--color-blue-400)',

        'secondary-bg-low': 'var(--color-green-800)',
        'secondary-bg': 'var(--color-green-900)',
        'secondary-bg-high': 'var(--color-green-950)',
        'secondary-fg-low': 'var(--color-green-100)',
        'secondary-fg': 'var(--color-green-300)',
        'secondary-fg-high': 'var(--color-green-400)',

        'tertiary-bg-low': 'var(--color-indigo-800)',
        'tertiary-bg': 'var(--color-indigo-900)',
        'tertiary-bg-high': 'var(--color-indigo-950)',
        'tertiary-fg-low': 'var(--color-indigo-100)',
        'tertiary-fg': 'var(--color-indigo-300)',
        'tertiary-fg-high': 'var(--color-indigo-400)',

        'surface-bg-low': 'var(--color-slate-800)',
        'surface-bg': 'var(--color-slate-900)',
        'surface-bg-high': 'var(--color-slate-950)',
        'surface-fg-low': 'var(--color-slate-100)',
        'surface-fg': 'var(--color-slate-300)',
        'surface-fg-high': 'var(--color-slate-400)',

        'error-bg-low': 'var(--color-red-800)',
        'error-bg': 'var(--color-red-900)',
        'error-bg-high': 'var(--color-red-950)',
        'error-fg-low': 'var(--color-red-100)',
        'error-fg': 'var(--color-red-300)',
        'error-fg-high': 'var(--color-red-400)',
    },
    light: {
        'primary-bg-low': 'var(--color-blue-100)',
        'primary-bg': 'var(--color-blue-300)',
        'primary-bg-high': 'var(--color-blue-400)',
        'primary-fg-low': 'var(--color-blue-800)',
        'primary-fg': 'var(--color-blue-900)',
        'primary-fg-high': 'var(--color-blue-950)',

        'secondary-bg-low': 'var(--color-green-100)',
        'secondary-bg': 'var(--color-green-300)',
        'secondary-bg-high': 'var(--color-green-400)',
        'secondary-fg-low': 'var(--color-green-800)',
        'secondary-fg': 'var(--color-green-900)',
        'secondary-fg-high': 'var(--color-green-950)',

        'tertiary-bg-low': 'var(--color-indigo-100)',
        'tertiary-bg': 'var(--color-indigo-300)',
        'tertiary-bg-high': 'var(--color-indigo-400)',
        'tertiary-fg-low': 'var(--color-indigo-800)',
        'tertiary-fg': 'var(--color-indigo-900)',
        'tertiary-fg-high': 'var(--color-indigo-950)',

        'surface-bg-low': 'var(--color-slate-100)',
        'surface-bg': 'var(--color-slate-300)',
        'surface-bg-high': 'var(--color-slate-400)',
        'surface-fg-low': 'var(--color-slate-800)',
        'surface-fg': 'var(--color-slate-900)',
        'surface-fg-high': 'var(--color-slate-950)',

        'error-bg-low': 'var(--color-red-100)',
        'error-bg': 'var(--color-red-300)',
        'error-bg-high': 'var(--color-red-400)',
        'error-fg-low': 'var(--color-red-800)',
        'error-fg': 'var(--color-red-900)',
        'error-fg-high': 'var(--color-red-950)',
    },
    radius: {
        'xs': 0.5,
        'sm': 0.5,
        'md': 0.5,
        'lg': 0.5,
        'xl': 0.5,
        '2xl': 0.5,
        '3xl': 1,
        '4xl': 1
    },
    'transitionDuration': 500
} as Scheme;
