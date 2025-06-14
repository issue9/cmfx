// SPDX-FileCopyrightText: 2025 caixw
//
// SPDX-License-Identifier: MIT

import { expect, test } from 'vitest';

import { classList } from './func';

test('classList', () => {
    expect(classList()).toBeUndefined();
    expect(classList({})).toBeUndefined();
    expect(classList(undefined, '')).toEqual('');
    expect(classList({}, '')).toEqual('');

    expect(classList({ 'a': true, 'b': false, 'c': undefined, 'd': true })).toEqual('a d');
    expect(classList({ 'a': true, 'b': false, 'c': undefined, 'd': true }, 'abc', 'def')).toEqual('a d abc def');
});
