// SPDX-FileCopyrightText: 2024 caixw
//
// SPDX-License-Identifier: MIT

import preset from '@cmfx/admin/tailwind.preset.ts';
import type { Config } from 'tailwindcss';


export default {
    presets: [preset],
    content: [
        'index.html',
        './src/**/*.{js,ts,jsx,tsx,css,md,mdx,html,scss}',
        '../../admin/src/**/*.{js,ts,jsx,tsx,css,md,mdx,html,scss}'
    ],
    theme: {
        extend: {},
    },
    plugins: [],
} satisfies Config;
