// SPDX-FileCopyrightText: 2025 caixw
//
// SPDX-License-Identifier: MIT

import { API, Config, Locale, Problem } from '@cmfx/core';
import { HashRouter } from '@solidjs/router';
import { render } from '@solidjs/testing-library';
import userEvent from '@testing-library/user-event';
import { ParentProps } from 'solid-js';
import { expect, test } from 'vitest';

import { build } from '@components/context/context';
import { Pagination } from './pagination';

test('pagination', async () => {
    const api = await API.build('token', 'http://localhost', '/login', 'application/json', 'application/yaml', 'zh-Hans', localStorage);
    Locale.init('en', api);

    const user = userEvent.setup();
    let curr: number;

    const { container, unmount } = render(() => <Pagination count={5} value={3} onChange={(val) => curr=val} />, {
        wrapper: (props: ParentProps) => {
            const Root = () => {
                const { Provider } = build(new Config('id'), {
                    title: 'title',
                    titleSeparator: '-',
                    pageSize: 20,
                    pageSizes: [10, 20, 30],
                    api: api,
                    outputProblem: async function <P>(p?: Problem<P>): Promise<void> {
                        console.error(p);
                    }
                });
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