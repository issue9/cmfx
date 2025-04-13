// SPDX-FileCopyrightText: 2025 caixw
//
// SPDX-License-Identifier: MIT

import { API } from '@cmfx/core';
import { HashRouter } from '@solidjs/router';
import { render } from '@solidjs/testing-library';
import userEvent from '@testing-library/user-event';
import { ParentProps } from 'solid-js';
import { expect, test } from 'vitest';

import { buildContext } from '@/components/context/context';
import { options } from '@/components/context/options/options.spec';
import { Locale } from '@/core';
import { Pagination } from './pagination';

test('pagination', async () => {
    const ao = options.api;
    const api = await API.build(options.id, ao.base, ao.token, ao.contentType, ao.acceptType, 'zh-Hans', localStorage);
    Locale.init('en', api);

    const user = userEvent.setup();
    let curr: number;

    const { container, unmount } = render(() => <Pagination count={5} value={3} onChange={(val) => curr=val} />, {
        wrapper: (props: ParentProps) => {
            const Root = () => {
                const { Provider } = buildContext(options, api);
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