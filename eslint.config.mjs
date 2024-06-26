// SPDX-FileCopyrightText: 2024 caixw
//
// SPDX-License-Identifier: MIT

import globals from 'globals';
import stylisticTs from '@stylistic/eslint-plugin-ts';
import parserTs from '@typescript-eslint/parser';

export default [
    {
        languageOptions: {
            globals: globals.browser,
            parser: parserTs
        },
        files: ['**/*.ts', '**/*.mts', '**/*.mjs', '**/*.tsx'],
        plugins: {
            '@stylistic/ts': stylisticTs
        },
        rules: {
            '@stylistic/ts/indent': ['error', 4, { 'SwitchCase': 0 }],
            '@stylistic/ts/quotes': ['error', 'single'],
            '@stylistic/ts/semi': ['error', 'always'],
            '@stylistic/ts/space-before-blocks': 'error'
        }
    }
];
