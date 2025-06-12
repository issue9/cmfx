// SPDX-FileCopyrightText: 2025 caixw
//
// SPDX-License-Identifier: MIT

import { sleep } from '@cmfx/core';
import { render } from '@solidjs/testing-library';
import userEvent from '@testing-library/user-event';
import { expect, test } from 'vitest';

import { Provider } from '@/context/context.spec';
import { default as Calendar } from './calendar';

test('Calendar', async () => {
    const user = userEvent.setup();
    let curr: Date | undefined;

    const { container, unmount } = render(() => <Calendar onSelected={d=>curr=d} />, {
        wrapper: Provider,
    });
    await sleep(500); // Provider 是异步的，需要等待其完成加载。
    const c = container.children.item(0)! as HTMLElement;
    expect(c).toHaveClass('c--calendar');
    
    const trs = c.querySelectorAll('tbody>tr');
    expect(trs.length).toBeGreaterThanOrEqual(5); // 确保有数据产生

    expect(curr).toBeUndefined(); // 未点击
    await user.click(trs[2].firstChild as HTMLElement);
    expect(curr).toBeTruthy();
    
    unmount();
});