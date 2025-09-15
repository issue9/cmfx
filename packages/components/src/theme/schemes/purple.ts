// SPDX-FileCopyrightText: 2025 caixw
//
// SPDX-License-Identifier: MIT

// 采用 oklch 作为颜色值

import { Scheme } from '@/base';

export default {
    contrast: 60,
    fontSize: '16px',
    dark: {
        'error-bg': 'oklch(30.66% 0.242 51.977)',
        'error-fg': 'oklch(87.6% 0.242 51.977)',
        'error-bg-low': 'oklch(45.08% 0.14 51.977)',
        'error-fg-low': 'oklch(64.4% 0.14 51.977)',
        'error-bg-high': 'oklch(42.975% 0.118 51.977)',
        'error-fg-high': 'oklch(95.5% 0.118 51.977)',
        'surface-bg': 'oklch(30.835% 0.211 144.8)',
        'surface-fg': 'oklch(88.1% 0.211 144.8)',
        'surface-bg-low': 'oklch(45.85% 0.037 144.8)',
        'surface-fg-low': 'oklch(65.5% 0.037 144.8)',
        'surface-bg-high': 'oklch(43.245% 0.073 144.8)',
        'surface-fg-high': 'oklch(96.1% 0.073 144.8)',
        'primary-bg': 'oklch(30.695% 0.231 244.97)',
        'primary-fg': 'oklch(87.7% 0.231 244.97)',
        'primary-bg-low': 'oklch(43.33% 0.032 244.97)',
        'primary-fg-low': 'oklch(61.9% 0.032 244.97)',
        'primary-bg-high': 'oklch(43.425% 0.129 244.97)',
        'primary-fg-high': 'oklch(96.5% 0.129 244.97)',
        'secondary-bg': 'oklch(30.73% 0.249 295.54)',
        'secondary-fg': 'oklch(87.8% 0.249 295.54)',
        'secondary-bg-low': 'oklch(39.2% 0.148 295.54)',
        'secondary-fg-low': 'oklch(56% 0.148 295.54)',
        'secondary-bg-high': 'oklch(43.155% 0.07 295.54)',
        'secondary-fg-high': 'oklch(95.9% 0.07 295.54)',
        'tertiary-bg': 'oklch(30.66% 0.245 351.09)',
        'tertiary-fg': 'oklch(87.6% 0.245 351.09)',
        'tertiary-bg-low': 'oklch(44.1% 0.129 351.09)',
        'tertiary-fg-low': 'oklch(63% 0.129 351.09)',
        'tertiary-bg-high': 'oklch(43.425% 0.071 351.09)',
        'tertiary-fg-high': 'oklch(96.5% 0.071 351.09)'
    },
    light: {
        'error-bg': 'oklch(87.6% 0.242 51.977)',
        'error-fg': 'oklch(30.66% 0.242 51.977)',
        'error-bg-low': 'oklch(64.4% 0.14 51.977)',
        'error-fg-low': 'oklch(45.08% 0.14 51.977)',
        'error-bg-high': 'oklch(95.5% 0.118 51.977)',
        'error-fg-high': 'oklch(42.975% 0.118 51.977)',
        'surface-bg': 'oklch(88.1% 0.211 144.8)',
        'surface-fg': 'oklch(30.835% 0.211 144.8)',
        'surface-bg-low': 'oklch(65.5% 0.037 144.8)',
        'surface-fg-low': 'oklch(45.85% 0.037 144.8)',
        'surface-bg-high': 'oklch(96.1% 0.073 144.8)',
        'surface-fg-high': 'oklch(43.245% 0.073 144.8)',
        'primary-bg': 'oklch(87.7% 0.231 244.97)',
        'primary-fg': 'oklch(30.695% 0.231 244.97)',
        'primary-bg-low': 'oklch(61.9% 0.032 244.97)',
        'primary-fg-low': 'oklch(43.33% 0.032 244.97)',
        'primary-bg-high': 'oklch(96.5% 0.129 244.97)',
        'primary-fg-high': 'oklch(43.425% 0.129 244.97)',
        'secondary-bg': 'oklch(87.8% 0.249 295.54)',
        'secondary-fg': 'oklch(30.73% 0.249 295.54)',
        'secondary-bg-low': 'oklch(56% 0.148 295.54)',
        'secondary-fg-low': 'oklch(39.2% 0.148 295.54)',
        'secondary-bg-high': 'oklch(95.9% 0.07 295.54)',
        'secondary-fg-high': 'oklch(43.155% 0.07 295.54)',
        'tertiary-bg': 'oklch(87.6% 0.245 351.09)',
        'tertiary-fg': 'oklch(30.66% 0.245 351.09)',
        'tertiary-bg-low': 'oklch(63% 0.129 351.09)',
        'tertiary-fg-low': 'oklch(44.1% 0.129 351.09)',
        'tertiary-bg-high': 'oklch(96.5% 0.071 351.09)',
        'tertiary-fg-high': 'oklch(43.425% 0.071 351.09)'
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
