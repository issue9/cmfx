// SPDX-FileCopyrightText: 2025-2026 caixw
//
// SPDX-License-Identifier: MIT

import { describe, expect, test } from 'vitest';

import { match } from './match';

describe('match', () => {
	test('lookup', () => {
		expect(match('en-US', ['en-US'], 'und', { localeMatcher: 'lookup' })).toEqual('en-US');
		expect(match('en-US', ['en-us'], 'und', { localeMatcher: 'lookup' })).toEqual('en-us'); // 注意大小写
		expect(match('zh', ['en-US'], 'und', { localeMatcher: 'lookup' })).toEqual('und');
	});

	test('best fit', () => {
		expect(match('en-US', ['en-US', 'en-GB'], 'und', { localeMatcher: 'best fit' })).toEqual('en-US'); // 完全匹配，不会触发 best fit
		expect(match('zh-hans-CN', ['zh-Hans', 'zh', 'zh-Hans-CN'], 'und', { localeMatcher: 'best fit' })).toEqual(
			'zh-Hans-CN',
		); // 不同的大小写，不触发 best fit
		expect(match('zh', ['en-US'], 'und', { localeMatcher: 'best fit' })).toEqual('und');

		expect(match('zh-CN', ['zh', 'zh-Hans'], 'und', { localeMatcher: 'best fit' })).toEqual('zh');
		expect(match('zh-CN', ['zh-Hans', 'zh', 'zh-Hans-CN'], 'und', { localeMatcher: 'best fit' })).toEqual('zh-Hans-CN');
		expect(match('zh-CN', ['zh-Hans', 'zh', 'zho-Hans-CN'], 'und', { localeMatcher: 'best fit' })).toEqual(
			'zho-Hans-CN',
		);
		expect(match('en-CN', ['zh-TW', 'zh-cn'], 'und', { localeMatcher: 'best fit' })).toEqual('zh-cn');
		expect(match('zh-Hans', ['ZH', 'VI'], 'und', { localeMatcher: 'best fit' })).toEqual('ZH');
	});
});
