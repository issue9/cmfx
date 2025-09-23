// SPDX-FileCopyrightText: 2025 caixw
//
// SPDX-License-Identifier: MIT

import { expect, test } from 'vitest';

import { classList } from './func';

test('classList', () => {
    expect(classList()).toBeUndefined();
    expect(classList(undefined, {})).toBeUndefined();
    expect(classList(undefined, undefined, '')).toBeUndefined();
    expect(classList(undefined, undefined, '', null)).toBeUndefined();
    expect(classList(undefined, undefined, '', '')).toBeUndefined();
    expect(classList(undefined, {}, '')).toBeUndefined();

    expect(classList('error', { 'a': true, 'b': false, 'c': undefined, 'd': true }))
        .toEqual('palette--error a d');
    expect(classList(undefined, { 'a': true, 'b': false, 'c': undefined, 'd': true }, 'abc', 'def'))
        .toEqual('a d abc def');
    expect(classList(undefined, { 'a': true, 'b': false, 'c': undefined, 'd': true }, 'abc', 'def', ''))
        .toEqual('a d abc def');
    expect(classList('surface', { 'a': true, 'b': false, 'c': undefined, 'd': true }, 'abc', 'def', undefined))
        .toEqual('palette--surface a d abc def');
});
