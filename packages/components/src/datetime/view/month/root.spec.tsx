// SPDX-FileCopyrightText: 2025-2026 caixw
//
// SPDX-License-Identifier: MIT

import userEvent from '@testing-library/user-event';
import { describe, expect, test } from 'vitest';

import { ComponentTester } from '@components/context/options/context.spec';
import { inRange, isCovered, Root } from './root';
import styles from './style.module.css';
import type { Ref } from './types';

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

describe('MonthView', async () => {
	const user = userEvent.setup();
	let curr: Date | undefined;
	let ref: Ref;

	const ct = await ComponentTester.build('MonthView', props => (
		<Root
			{...props}
			ref={el => (ref = el)}
			onClick={d => {
				curr = d;
			}}
			weekName="long"
			initValue={new Date()}
			todayClass="today"
			coveredClass="cover"
			selectedClass="sel"
			disabledClass="disabled"
		/>
	));

	test('props', () => ct.testProps());

	test('ref', () => {
		expect(ref).toBeDefined();
		expect(ref.root()).toBeInstanceOf(HTMLFieldSetElement);
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

describe('isCovered', () => {
	const now = new Date();
	const after = new Date(now.getTime() + 87400 * 1000);
	const before = new Date(now.getTime() - 87400 * 1000);

	test('undefined', () => expect(isCovered(now)).toBe(false));

	test('[undefined,before]', () => expect(isCovered(now, [undefined, before])).toBe(false));
	test('[undefined,after]', () => expect(isCovered(now, [undefined, after])).toBe(true));

	test('[before,undefined]', () => expect(isCovered(now, [before, undefined])).toBe(true));
	test('[after,undefined]', () => expect(isCovered(now, [after, undefined])).toBe(false));

	test('[before,before]', () => expect(isCovered(now, [before, before])).toBe(false));
	test('[after,after]', () => expect(isCovered(now, [after, after])).toBe(false));
	test('[before,after]', () => expect(isCovered(now, [before, after])).toBe(true));
	test('[after,before]', () => expect(isCovered(now, [after, before])).toBe(false));
});
