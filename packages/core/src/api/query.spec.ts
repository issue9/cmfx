// SPDX-FileCopyrightText: 2024-2026 caixw
//
// SPDX-License-Identifier: MIT

import { expect, test } from 'vitest';

import { query2Search } from './query';

test('query2Search', () => {
	expect(query2Search({ str: 'str' })).toEqual('?str=str');
	expect(query2Search({ str: 'str', page: 1 })).toEqual('?str=str&page=0');
	expect(query2Search({ str: 'str', num: 0, bool: false })).toEqual('?str=str&num=0&bool=false');
	expect(query2Search({ str: ['str'], num: [0, 1], bool: false })).toEqual('?str=str&num=0%2C1&bool=false');
	expect(query2Search({})).toEqual('');
});
