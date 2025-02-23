// SPDX-FileCopyrightText: 2024-2025 caixw
//
// SPDX-License-Identifier: MIT

import { includeIgnoreFile } from '@eslint/compat';
import stylisticTs from '@stylistic/eslint-plugin-ts';
import parserTs from '@typescript-eslint/parser';
import globals from 'globals';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const gitignorePath = path.resolve(__dirname, '.gitignore');

export default [
    includeIgnoreFile(gitignorePath),
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
