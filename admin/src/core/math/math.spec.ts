// SPDX-FileCopyrightText: 2024 caixw
//
// SPDX-License-Identifier: MIT

import { expect, test } from 'vitest';

import { divide } from './math';

test('divide', () => {
    expect(divide(2, 1)).toEqual([2, 0]);
    expect(divide(5, 2)).toEqual([2, 1]);
});
