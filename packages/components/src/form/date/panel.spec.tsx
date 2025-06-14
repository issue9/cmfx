// SPDX-FileCopyrightText: 2025 caixw
//
// SPDX-License-Identifier: MIT

import { sleep } from '@cmfx/core';
import { render } from '@solidjs/testing-library';
import userEvent from '@testing-library/user-event';
import { expect, test } from 'vitest';

import { Provider } from '@/context/context.spec';
import { FieldAccessor } from '@/form/field';
import { DatePanel } from './panel';
import styles from './style.module.css';

test('DatePanel', async () => {
    const user = userEvent.setup();
    let curr: number | undefined;
    const access = FieldAccessor('date', '2024-01-02');

    const { container, unmount } = render(() => <DatePanel accessor={access} now={()=>curr=1} />, {
        wrapper: Provider,
    });
    await sleep(500); // Provider 是异步的，需要等待其完成加载。
    const c = container.children.item(0)! as HTMLElement;
    expect(c).toHaveClass(styles.panel);
    
    const trs = c.querySelectorAll('tbody>tr');
    expect(trs.length).toBeGreaterThanOrEqual(5); // 确保有数据产生

    expect(curr).toBeUndefined(); // 未点击
    await user.click(c.querySelector(`.${styles.actions} .${styles.left} button`) as HTMLElement); // 点击今日按钮
    expect(parseInt(access.getValue().substring(0, 4))).toEqual(2024); // 未点击确认
    expect(curr).toEqual(1);
    
    await user.click(c.querySelectorAll(`.${styles.actions} .${styles.right} button`).item(1) as HTMLElement); // 点击确认按钮
    expect(curr).toEqual(1);
    expect(parseInt(access.getValue().substring(0, 4))).toBeGreaterThan(2024);

    unmount();
});
