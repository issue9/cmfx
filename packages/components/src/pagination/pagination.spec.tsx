// SPDX-FileCopyrightText: 2025 caixw
//
// SPDX-License-Identifier: MIT

import { API, Config, Locale, Problem, Theme } from '@cmfx/core';
import { HashRouter } from '@solidjs/router';
import { render } from '@solidjs/testing-library';
import userEvent from '@testing-library/user-event';
import { ParentProps } from 'solid-js';
import { expect, test } from 'vitest';

import { init } from '@/context/context';
import { Pagination } from './pagination';

test('pagination', async () => {
    const conf = new Config('admin', '');
    const api = await API.build(conf, 'http://localhost', '/login', 'application/json', 'application/yaml', 'zh-Hans');
    Locale.init(conf, 'en', api);

    const user = userEvent.setup();
    let curr: number;

    const { Provider } = await init({
        scheme: Theme.genScheme(5),
        locale: 'zh-Hans',
        messages: {'zh-Hans': [async()=>(await import('@/messages/zh-Hans.lang')).default]},
        config: conf,
        title: 'title',
        titleSeparator: '-',
        pageSize: 20,
        pageSizes: [10, 20, 30],
        api: api,
        outputProblem: async function <P>(p?: Problem<P>): Promise<void> {
            console.error(p);
        },
    });

    const { container, unmount } = render(() => <Pagination count={5} value={3} onChange={(val) => curr=val} />, {
        wrapper: (props: ParentProps) => {
            const Root = () => {
                return <Provider>{props.children}</Provider>;
            };

            return <HashRouter root={Root}>{[]}</HashRouter>;
        },
    });
    const c = container.children.item(0)!;
    expect(c).toHaveClass('c--pagination');

    await user.click(c.firstChild as HTMLElement);
    expect(curr!).toEqual(1);

    await user.click(c.lastChild as HTMLElement);
    expect(curr!).toEqual(5);

    unmount();
});