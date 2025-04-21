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

export default [
    includeIgnoreFile(path.resolve(__dirname, '.gitignore')),

    includeIgnoreFile(path.resolve(__dirname, 'packages/core/.gitignore')),
    includeIgnoreFile(path.resolve(__dirname, 'packages/components/.gitignore')),
    includeIgnoreFile(path.resolve(__dirname, 'packages/admin/.gitignore')),

    includeIgnoreFile(path.resolve(__dirname, 'cmd/admin/.gitignore')),
    includeIgnoreFile(path.resolve(__dirname, 'cmd/components/.gitignore')),
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
