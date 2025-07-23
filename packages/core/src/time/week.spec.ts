// SPDX-FileCopyrightText: 2025 caixw
//
// SPDX-License-Identifier: MIT

import { expect, test } from 'vitest';

import { getISOWeek, getISOWeekRange, getISOWeekRangeByWeek } from './week';

test('getISOWeek', () => {
    expect(getISOWeek(new Date('2023-01-01'))).toStrictEqual([2022, 52]);
    expect(getISOWeek(new Date('2023-06-15'))).toStrictEqual([2023, 24]);
    expect(getISOWeek(new Date('2023-12-31'))).toStrictEqual([2023, 52]);
    expect(getISOWeek(new Date('2024-01-01'))).toStrictEqual([2024, 1]);
    expect(getISOWeek(new Date('2024-12-31'))).toStrictEqual([2025, 1]);
    expect(getISOWeek(new Date('2025-01-01'))).toStrictEqual([2025, 1]);
});

test('getISOWeekRange', () => {
    expect(getISOWeekRange(new Date('2023-01-01'))).toStrictEqual([new Date('2022-12-26'), new Date('2023-01-01')]);
    expect(getISOWeekRange(new Date('2023-06-15'))).toStrictEqual([new Date('2023-06-12'), new Date('2023-06-18')]);
    expect(getISOWeekRange(new Date('2023-12-31'))).toStrictEqual([new Date('2023-12-25'), new Date('2023-12-31')]);
    expect(getISOWeekRange(new Date('2024-01-01'))).toStrictEqual([new Date('2024-01-01'), new Date('2024-01-07')]);
    expect(getISOWeekRange(new Date('2024-12-31'))).toStrictEqual([new Date('2024-12-30'), new Date('2025-01-05')]);
    expect(getISOWeekRange(new Date('2025-01-01'))).toStrictEqual([new Date('2024-12-30'), new Date('2025-01-05')]);
});


test('getISOWeekRangeByWeek', () => {
    expect(getISOWeekRangeByWeek(2022, 52)).toStrictEqual([new Date(2022, 11, 26), new Date(2023, 0, 1)]);
    expect(getISOWeekRangeByWeek(2023, 24)).toStrictEqual([new Date(2023, 5, 12), new Date(2023, 5, 18)]);
    expect(getISOWeekRangeByWeek(2023, 52)).toStrictEqual([new Date(2023, 11, 25), new Date(2023, 11, 31)]);
    expect(getISOWeekRangeByWeek(2024, 1)).toStrictEqual([new Date(2024, 0, 1), new Date(2024, 0, 7)]);
    expect(getISOWeekRangeByWeek(2025, 1)).toStrictEqual([new Date(2024, 11, 30), new Date(2025, 0, 5)]);
    expect(getISOWeekRangeByWeek(2025, 1)).toStrictEqual([new Date(2024, 11, 30), new Date(2025, 0, 5)]);
});
