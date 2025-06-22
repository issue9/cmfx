// SPDX-FileCopyrightText: 2025 caixw
//
// SPDX-License-Identifier: MIT

import { Options, genScheme } from '@cmfx/components';
import { Problem } from '@cmfx/core';

export const options: Options = {
    id: 'admin',
    configName: '',
    storage: window.sessionStorage,
    scheme: genScheme(10),
    mode: 'system',
    locale: 'zh-Hans',
    unitStyle: 'full',
    messages: {
        'en': [
            async () => (await import('@cmfx/components/messages/en.lang.js')).default
        ],
        'zh-Hans': [
            async () => (await import('@cmfx/components/messages/zh-Hans.lang.js')).default
        ],
    },

    apiBase: 'http://localhost:8080',
    apiToken: '/login',
    apiAcceptType: 'application/json',
    apiContentType: 'application/json',
    title: 'title',
    titleSeparator: '-',
    pageSizes: [10, 20, 50, 100, 200, 500],
    pageSize: 20,
    outputProblem: async function <P>(p?: Problem<P>): Promise<void> {
        console.error(p ? p.title : '');
    }
};
