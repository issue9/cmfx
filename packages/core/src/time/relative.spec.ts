// SPDX-FileCopyrightText: 2025-2026 caixw
//
// SPDX-License-Identifier: MIT

import { expect, test } from 'vitest';

import { day, ms, second } from './duration';
import { nano2IntlRelative } from './relative';

test('nano2IntlRelative', () => {
	expect(nano2IntlRelative(99)).toEqual([0, 'seconds']); // 值太小了
	expect(nano2IntlRelative(99 * ms)).toEqual([0.1, 'seconds']);
	expect(nano2IntlRelative(35 * second)).toEqual([35, 'seconds']);
	expect(nano2IntlRelative(60 * second)).toEqual([1, 'minutes']);
	expect(nano2IntlRelative(99 * second)).toEqual([2, 'minutes']);
	expect(nano2IntlRelative(2 * day)).toEqual([2, 'days']);
	expect(nano2IntlRelative(14 * day)).toEqual([2, 'weeks']);
	expect(nano2IntlRelative(89 * day)).toEqual([3, 'months']);
	expect(nano2IntlRelative(91 * day)).toEqual([1, 'quarters']);
	expect(nano2IntlRelative(400 * day)).toEqual([1, 'years']);

	expect(nano2IntlRelative(-60 * second)).toEqual([-1, 'minutes']);
	expect(nano2IntlRelative(-99 * second)).toEqual([-2, 'minutes']);
	expect(nano2IntlRelative(-2 * day)).toEqual([-2, 'days']);
	expect(nano2IntlRelative(-91 * day)).toEqual([-1, 'quarters']);
	expect(nano2IntlRelative(-400 * day)).toEqual([-1, 'years']);
});
