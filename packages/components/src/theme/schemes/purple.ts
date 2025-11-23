// SPDX-FileCopyrightText: 2025 caixw
//
// SPDX-License-Identifier: MIT

// 采用 oklch 作为颜色值

import { Scheme } from '@/base';

export default {
    fontSize: '16px',
    error: 'oklch(30.66% 0.242 51.977)',
    surface: 'oklch(30.835% 0.211 144.8)',
    primary: 'oklch(30.695% 0.231 244.97)',
    secondary: 'oklch(30.73% 0.249 295.54)',
    tertiary: 'oklch(30.66% 0.245 351.09)',
    radius: {
        'xs': 0.5,
        'sm': 0.5,
        'md': 0.5,
        'lg': 0.5,
        'xl': 0.5,
    },
    'transitionDuration': 800
} as Scheme;
