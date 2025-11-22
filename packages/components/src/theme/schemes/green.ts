// SPDX-FileCopyrightText: 2025 caixw
//
// SPDX-License-Identifier: MIT

// 采用变量名作为颜色值

import { Scheme } from '@/base';

export default {
    contrast: 60,
    fontSize: '16px',
    primary: 'var(--color-blue-900)',
    secondary: 'var(--color-green-900)',
    tertiary: 'var(--color-indigo-900)',
    surface: 'var(--color-slate-900)',
    error: 'var(--color-red-900)',
    radius: {
        'xs': 0,
        'sm': 0,
        'md': 0,
        'lg': 0,
        'xl': 0.5,
    },
    'transitionDuration': 300
} as Scheme;
