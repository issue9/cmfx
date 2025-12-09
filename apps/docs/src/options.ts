// SPDX-FileCopyrightText: 2025 caixw
//
// SPDX-License-Identifier: MIT

import { Options, Scheme, schemes, createChartLocaleLoader } from '@cmfx/components';
import { Config, Problem, createZodLocaleLoader } from '@cmfx/core';

export const options: Options = {
    config: new Config('admin', '', window.sessionStorage),
    mode: 'system',
    locale: 'zh-Hans',
    displayStyle: 'full',
    logo: '/brand-static.svg',
    systemDialog: false,
    systemNotify: false,
    timezone: 'Asia/Shanghai',
    messages: {
        'en': [
            async () => (await import('@cmfx/components/messages/en.lang.js')).default,
            async () => (await import('./messages/en.lang.js')).default,
            createChartLocaleLoader((await import('../node_modules/echarts/lib/i18n/langEN.js')).default),
            createZodLocaleLoader((await import('../node_modules/zod/v4/locales/en.js')).default),
        ],
        'zh-Hans': [
            async () => (await import('@cmfx/components/messages/zh-Hans.lang.js')).default,
            async () => (await import('./messages/zh-Hans.lang.js')).default,
            createChartLocaleLoader((await import('../node_modules/echarts/lib/i18n/langZH.js')).default),
            createZodLocaleLoader((await import('../node_modules/zod/v4/locales/zh-CN.js')).default),
        ],
    },

    scheme: 'green',
    schemes: new Map<string, Scheme>([
        ['purple', schemes.purple],
        ['green', schemes.green]
    ]),

    title: 'CMFX',
    titleSeparator: ' - ',
    pageSizes: [10, 20, 50, 100, 200, 500],
    pageSize: 20,
    stays: 2000,
    problemHandler: async function <P>(p?: Problem<P>): Promise<void> {
        console.error(p ? p.title : '');
    }
};
