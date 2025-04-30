// SPDX-FileCopyrightText: 2025 caixw
//
// SPDX-License-Identifier: MIT

import { Problem, sleep, Theme } from '@cmfx/core';
import { HashRouter } from '@solidjs/router';
import { render } from '@solidjs/testing-library';
import userEvent from '@testing-library/user-event';
import { ParentProps } from 'solid-js';
import { expect, test } from 'vitest';

import { Options, OptionsProvider } from '@/context';
import { Pagination } from './pagination';

test('pagination', async () => {
    const user = userEvent.setup();
    let curr: number;

    const o: Options = {
        id: 'admin',
        storage: window.localStorage,
        configName: '',
        scheme: Theme.genScheme(5),
        contrast: 'more',
        mode: 'dark',
        locale: 'zh-Hans',
        unitStyle: 'full',
        messages: {'zh-Hans': [async()=>(await import('@/messages/zh-Hans.lang')).default]},
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

    const { container, unmount } = render(() => <Pagination count={5} value={3} onChange={(val) => curr=val} />, {
        wrapper: (props: ParentProps) => {
            const Root = () => {
                return <OptionsProvider {...o}>{props.children}</OptionsProvider>;
            };

            return <HashRouter root={Root}>{[]}</HashRouter>;
        },
    });
    await sleep(500); // OptionsProvider 是异步的，需要等待其完成加载。
    const c = container.children.item(0)!;
    expect(c).toHaveClass('c--pagination');

    await user.click(c.firstChild as HTMLElement);
    expect(curr!).toEqual(1);

    await user.click(c.lastChild as HTMLElement);
    expect(curr!).toEqual(5);

    unmount();
});