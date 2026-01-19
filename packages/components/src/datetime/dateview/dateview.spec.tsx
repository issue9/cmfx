// SPDX-FileCopyrightText: 2025-2026 caixw
//
// SPDX-License-Identifier: MIT

import userEvent from '@testing-library/user-event';
import { describe, expect, test } from 'vitest';

import { ComponentTester } from '@components/context/context.spec';
import { default as DateView, inRange } from './dateview';
import styles from './style.module.css';

describe('inRange', () => {
    const val = new Date(2023, 1, 1);

    test('+', () => {
        // 正常范围之内
        expect(inRange(true, val, new Date(2023, 1, 1), new Date(2023, 1, 1))).toBe(true);
        expect(inRange(true, val, new Date(2022, 1, 1), new Date(2023, 1, 5))).toBe(true);

        expect(inRange(true, val, new Date(2023, 1, 29), new Date(2023, 1, 1))).toBe(true); // min 在一个月之内
        expect(inRange(true, val, new Date(2023, 3, 2), new Date(2024, 1, 3))).toBe(true); // min 不符合

        expect(inRange(true, val, new Date(2023, 1, 29), new Date(2022, 12, 15))).toBe(true); // max 在一个月之内
        expect(inRange(true, val, new Date(2022, 1, 2), new Date(2022, 11, 3))).toBe(false); // max 不符合

        expect(inRange(true, val, undefined, new Date(2023, 1, 3))).toBe(true);
        expect(inRange(true, val, undefined, new Date(2022, 1, 3))).toBe(false); // max 不符合

        expect(inRange(true, val, new Date(2022, 1, 2), undefined)).toBe(true);
        expect(inRange(true, val, new Date(2023, 2, 2), undefined)).toBe(true); // min 不符合
    });

    test('-', () => {
        // 正常范围之内
        expect(inRange(false, val, new Date(2023, 1, 1), new Date(2023, 1, 1))).toBe(true);
        expect(inRange(false, val, new Date(2022, 1, 1), new Date(2023, 1, 5))).toBe(true);

        expect(inRange(false, val, new Date(2023, 1, 29), new Date(2023, 1, 1))).toBe(true); // min 在一个月之内
        expect(inRange(false, val, new Date(2023, 3, 2), new Date(2024, 1, 3))).toBe(false); // min 不符合

        expect(inRange(false, val, new Date(2023, 1, 29), new Date(2022, 12, 15))).toBe(true); // max 在一个月之内
        expect(inRange(false, val, new Date(2022, 1, 2), new Date(2022, 11, 3))).toBe(true); // max 不符合

        expect(inRange(false, val, undefined, new Date(2023, 1, 3))).toBe(true);
        expect(inRange(false, val, undefined, new Date(2022, 1, 3))).toBe(true); // max 不符合

        expect(inRange(false, val, new Date(2022, 1, 2), undefined)).toBe(true);
        expect(inRange(false, val, new Date(2023, 2, 2), undefined)).toBe(false); // min 不符合
    });
});

describe('DateView', async () => {
    const user = userEvent.setup();
    let curr: Date | undefined;

    const ct = await ComponentTester.build(
        'DateView',
        props => <DateView {...props} ref={() => { }} onClick={d => curr = d}
            weekName='long' initValue={new Date()} todayClass='today'
            coveredClass='cover' selectedClass='sel' disabledClass='disabled'
        />
    );

    test('props', () => {
        ct.testProps();
    });

    test('hover & click', async () => {
        const root = ct.result.container.firstElementChild as HTMLElement;
        expect(root).toHaveClass(styles.dateview);

        const trs = root.querySelectorAll('tbody>tr');
        expect(trs.length).toBeGreaterThanOrEqual(5); // 确保有数据产生

        expect(curr).toBeUndefined(); // 未点击
        await user.click(trs[2].children.item(2) as HTMLTableCellElement);
        expect(curr).toBeTruthy();
    });
});
