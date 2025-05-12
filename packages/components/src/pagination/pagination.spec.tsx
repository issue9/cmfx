// SPDX-FileCopyrightText: 2025 caixw
//
// SPDX-License-Identifier: MIT

import { sleep } from '@cmfx/core';
import { render } from '@solidjs/testing-library';
import userEvent from '@testing-library/user-event';
import { expect, test } from 'vitest';

import { Provider } from '@/context/context.spec';
import { Pagination } from './pagination';

test('pagination', async () => {
    const user = userEvent.setup();
    let curr: number;

    const { container, unmount } = render(() => <Pagination count={5} value={3} onChange={(val) => curr=val} />, {
        wrapper: Provider,
    });
    await sleep(500); // Provider 是异步的，需要等待其完成加载。
    const c = container.children.item(0)!;
    expect(c).toHaveClass('c--pagination');

    await user.click(c.firstChild as HTMLElement);
    expect(curr!).toEqual(1);

    await user.click(c.lastChild as HTMLElement);
    expect(curr!).toEqual(5);

    unmount();
});