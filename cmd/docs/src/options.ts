// SPDX-FileCopyrightText: 2025 caixw
//
// SPDX-License-Identifier: MIT

import { Options, Scheme, schemes } from '@cmfx/components';
import { Problem } from '@cmfx/core';

export const options: Options = {
    id: 'admin',
    configName: '',
    storage: window.sessionStorage,
    mode: 'system',
    locale: 'zh-Hans',
    displayStyle: 'full',
    messages: {
        'en': [
            async () => (await import('@cmfx/components/messages/en.lang.js')).default,
            async () => (await import('./messages/en.lang.js')).default,
        ],
        'zh-Hans': [
            async () => (await import('@cmfx/components/messages/zh-Hans.lang.js')).default,
            async () => (await import('./messages/zh-Hans.lang.js')).default,
        ],
    },

    scheme: 'green',
    schemes: new Map<string, Scheme>([
        ['purple', schemes.purple],
        ['green', schemes.green]
    ]),

    apiBase: 'http://localhost:8080',
    apiToken: '/login',
    apiAcceptType: 'application/json',
    apiContentType: 'application/json',
    title: 'CMFX',
    titleSeparator: ' - ',
    pageSizes: [10, 20, 50, 100, 200, 500],
    pageSize: 20,
    stays: 2000,
    outputProblem: async function <P>(p?: Problem<P>): Promise<void> {
        console.error(p ? p.title : '');
    }
};
