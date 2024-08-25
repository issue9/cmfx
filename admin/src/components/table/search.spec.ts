// SPDX-FileCopyrightText: 2024 caixw
//
// SPDX-License-Identifier: MIT

import { expect, test } from 'vitest';

import { fromSearch } from './search';

test('fromSearch', () => {
    expect(fromSearch({ str: 'str' }, { str: 'str2' })).toEqual({ str: 'str2' });
    expect(fromSearch({ num: 0 }, { num: '22' })).toEqual({ num: 22 });
    expect(fromSearch({ bool: true }, { bool: '22' })).toEqual({ bool: true });
    expect(fromSearch({ bool: true, n: undefined }, { bool: '22', n: '5' })).toEqual({ bool: true, n: '5' });
});
