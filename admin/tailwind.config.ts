// SPDX-FileCopyrightText: 2024 caixw
//
// SPDX-License-Identifier: MIT

import type { Config } from 'tailwindcss';
import preset from './tailwind.preset';

export default {
    presets: [preset],
    content: [
        './src/**/*.{js,ts,jsx,tsx,css,md,mdx,html,scss}',
    ],
    theme: {
        extend: {},
    },
    plugins: [],
} satisfies Config;
