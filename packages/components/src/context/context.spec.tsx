// SPDX-FileCopyrightText: 2025 caixw
//
// SPDX-License-Identifier: MIT

import { Problem } from '@cmfx/core';
import { HashRouter } from '@solidjs/router';
import { ParentProps } from 'solid-js';
import { createStore } from 'solid-js/store';
import { expect, test } from 'vitest';

import { genScheme } from '@/base';
import { buildActions, OptionsProvider } from './context';
import { Options } from './options';

// 提供用于测试的配置项
const options: Options = {
    id: 'admin',
    storage: window.localStorage,
    configName: '',
    scheme: genScheme(5),
    contrast: 'more',
    mode: 'dark',
    locale: 'zh-Hans',
    unitStyle: 'full',
    messages: { 'zh-Hans': [async () => (await import('@/messages/zh-Hans.lang')).default] },
    apiBase: 'http://localhost:3000',
    apiToken: '/login',
    apiAcceptType: 'application/cbor',
    apiContentType: 'application/cbor',
    title: 'title',
    titleSeparator: '-',
    pageSize: 20,
    pageSizes: [10, 20, 30],
    outputProblem: async function <P>(p?: Problem<P>): Promise<void> {
        console.error(p);
    },
};

export function Provider(props: ParentProps) {
    const Root = () => {
        return <OptionsProvider {...options }>{props.children}</OptionsProvider>;
    };
    return <HashRouter root={Root}>{[]}</HashRouter>;
}

test('buildActions',  () => {
    const act = buildActions(createStore({...options}));
    expect(act).not.toBeUndefined();

    act.setTitle('t');
    expect(document.title, 't' + options.titleSeparator + options.title);
});