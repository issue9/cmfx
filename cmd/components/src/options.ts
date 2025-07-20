// SPDX-FileCopyrightText: 2025 caixw
//
// SPDX-License-Identifier: MIT

import { Options, Palettes, Scheme } from '@cmfx/components';
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
            async () => (await import('@cmfx/components/messages/en.lang.js')).default
        ],
        'zh-Hans': [
            async () => (await import('@cmfx/components/messages/zh-Hans.lang.js')).default
        ],
    },

    scheme: 'default',
    schemes: new Map<string, Scheme>([
        ['default', {
            contrast: 60,
            dark: {
                'primary-bg': '#333',
                'secondary-bg': '#666',
                'tertiary-bg': '#999',
                'surface-bg': '#bbb',
            } as Palettes,
            light: {
                'primary-bg': '#bbb',
                'secondary-bg': '#999',
                'tertiary-bg': '#666',
                'surface-bg': '#333',
            } as Palettes,
        }],
        ['default2', {
            contrast: 60,
            dark: {
                'primary-bg': '#333bbb',
                'secondary-bg': '#666999',
                'tertiary-bg': '#999666',
                'surface-bg': '#bbb333',
            } as Palettes,
            light: {
                'primary-bg': '#bbb333',
                'secondary-bg': '#999666',
                'tertiary-bg': '#666999',
                'surface-bg': '#333bbb',
            } as Palettes,
        }]
    ]),

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
