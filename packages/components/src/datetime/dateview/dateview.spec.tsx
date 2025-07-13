// SPDX-FileCopyrightText: 2025 caixw
//
// SPDX-License-Identifier: MIT

import { sleep } from '@cmfx/core';
import { render } from '@solidjs/testing-library';
import userEvent from '@testing-library/user-event';
import { createSignal } from 'solid-js';
import { expect, test } from 'vitest';

import { Provider } from '@/context/context.spec';
import { default as DateView } from './dateview';
import styles from './style.module.css';

test('DateView', async () => {
    const user = userEvent.setup();
    let curr: Date | undefined;
    const [val] = createSignal<Date>(new Date());

    const { container, unmount } = render(() => <DateView ref={() => { }} onClick={d => curr = d}
        weekName='long' value={val} todayClass='today' coveredClass='cover' selectedClass='sel' disabledClass='disabled'
    />, {
        wrapper: Provider,
    });
    await sleep(500); // Provider 是异步的，需要等待其完成加载。
    const c = container.children.item(0)! as HTMLElement;
    expect(c).toHaveClass(styles.panel);

    const trs = c.querySelectorAll('tbody>tr');
    expect(trs.length).toBeGreaterThanOrEqual(5); // 确保有数据产生

    expect(curr).toBeUndefined(); // 未点击
    await user.click(trs[2].firstChild as HTMLTableCellElement);
    expect(curr).toBeTruthy();

    unmount();
});
