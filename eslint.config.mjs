// SPDX-FileCopyrightText: 2024 caixw
//
// SPDX-License-Identifier: MIT

import globals from 'globals';
import pluginJs from '@eslint/js';
import tseslint from 'typescript-eslint';
import pluginVue from 'eslint-plugin-vue';

export default [
    pluginJs.configs.recommended,
    ...tseslint.configs.strict,
    //...tseslint.configs.stylistic,
    ...pluginVue.configs['flat/essential'],
    {
        languageOptions: { globals: globals.browser },
        files: ['**/*.ts', '**/*.vue', '**/*.tsx'],
        rules: {
            'no-unused-vars': 'error',
            'no-undef': 'warn',
            'indent': ['error', 4],
            'quotes': ['error', 'single'],
            'semi': ['error', 'always']
        }
    },
    { // 必须得是一个新对象，不能直接写在上面的对象中？
        ignores: ['**/*.js', '**/*.d.ts'],
    }
];
