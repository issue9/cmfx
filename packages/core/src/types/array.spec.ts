// SPDX-FileCopyrightText: 2025 caixw
//
// SPDX-License-Identifier: MIT

import { expect, test } from 'vitest';

import { arrayEqual } from './array';

test('arrayEqual', () => {
    expect(arrayEqual([1, 2, 3], [1, 2, 3])).toBe(true);
    expect(arrayEqual([2, 1, 3], [1, 2, 3])).toBe(false);

    const arr = [1, 2, 3];
    expect(arrayEqual(arr, arr)).toBe(true);
    arr[1] = 2;
    expect(arrayEqual(arr, arr)).toBe(true);
});
