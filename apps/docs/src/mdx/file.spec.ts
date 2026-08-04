// SPDX-FileCopyrightText: 2026 caixw
//
// SPDX-License-Identifier: MIT

import { describe, expect, test } from 'vitest';

import { fileObject2Map } from './index';

describe('fileObject2Map', () => {
	test('包含目录', () => {
		expect(
			fileObject2Map<string>({
				'/dir1/dir2/api.zh-Hans.json': 'zh',
				'/dir1/dir2/api.en.json': 'en',
			}),
		).toEqual(
			new Map([
				['zh-Hans', 'zh'],
				['en', 'en'],
			]),
		);
	});

	test('windows', () => {
		expect(
			fileObject2Map<string>({
				'.\\dir1\\dir2\\api.zh-Hans.json': 'zh',
				'.\\dir1\\dir2\\api.en.json': 'en',
			}),
		).toEqual(
			new Map([
				['zh-Hans', 'zh'],
				['en', 'en'],
			]),
		);
	});

	test('不包含目录', () => {
		expect(
			fileObject2Map<string>({
				'api.zh-Hans.json': 'zh',
				'api.en.json': 'en',
			}),
		).toEqual(
			new Map([
				['zh-Hans', 'zh'],
				['en', 'en'],
			]),
		);
	});
});
