// SPDX-FileCopyrightText: 2025 caixw
//
// SPDX-License-Identifier: MIT

import { expect, test } from 'vitest';

import { classList } from './func';

test('classList', () => {
    expect(classList()).toBeUndefined();
    expect(classList(undefined, {})).toBeUndefined();
    expect(classList('')).toEqual('');
    expect(classList('', {})).toEqual('');
    
    expect(classList(undefined, {'a':true,'b':false,'c':undefined,'d':true})).toEqual('a d ');
    expect(classList('abc', {'a':true,'b':false,'c':undefined,'d':true})).toEqual('a d abc');
});