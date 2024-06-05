// SPDX-FileCopyrightText: 2024 caixw
//
// SPDX-License-Identifier: MIT

import globals from 'globals';
import pluginJs from '@eslint/js';
import tseslint from 'typescript-eslint';
import pluginVue from 'eslint-plugin-vue';

/**
 * 在此添加一些缺失的全局类型
 */
const customGlobal = {
    RequestInit: false,
    BodyInit: false
}

export default [
    pluginJs.configs.recommended,
    ...tseslint.configs.strict,
    //...tseslint.configs.stylistic,
    ...pluginVue.configs['flat/essential'],
    {
        languageOptions: { globals: Object.assign(globals.browser, customGlobal) },
        files: ['**/*.ts', '**/*.vue', '**/*.tsx'],
        rules: {
            'no-undef': ['warn'],
            'indent': ['error', 4],
            'quotes': ['error', 'single'],
            'semi': ['error', 'always'],
            '@typescript-eslint/no-unused-vars': ['error', {'argsIgnorePattern': '^_'}]
        }
    },
    { // 必须得是一个新对象，不能直接写在上面的对象中！
        ignores: ['**/*.js', '**/*.d.ts'],
    }
];
