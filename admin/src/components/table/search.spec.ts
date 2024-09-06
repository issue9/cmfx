// SPDX-FileCopyrightText: 2024 caixw
//
// SPDX-License-Identifier: MIT

import { expect, test } from 'vitest';

import { fromSearch, query2Search } from './search';

test('fromSearch', () => {
    expect(fromSearch({ str: 'str' }, { str: 'str2' })).toEqual({ str: 'str2' });
    expect(fromSearch({ num: 0 }, { num: '22' })).toEqual({ num: 22 });
    expect(fromSearch({ bool: true }, { bool: '22' })).toEqual({ bool: true });
    expect(fromSearch({ bool: true, n: undefined }, { bool: '22', n: '5' })).toEqual({ bool: true, n: '5' });

    expect(fromSearch({ bool: [true], n: undefined }, { bool: 'true,false', n: '5' })).toEqual({ bool: [true,false], n: '5' });
    expect(fromSearch({ str: ['str'], n: undefined }, { str: 'true,false', n: '5' })).toEqual({ str: ['true','false'], n: '5' });
});

test('query2Search', () => {
    expect(query2Search({ str: 'str' })).toEqual('?str=str');
    expect(query2Search({ str: 'str', num: 0, bool: false })).toEqual('?str=str&num=0&bool=false');
    expect(query2Search({ str: ['str'], num: [0,1], bool: false })).toEqual('?str=str&num=0%2C1&bool=false');
    expect(query2Search({})).toEqual('');
});
