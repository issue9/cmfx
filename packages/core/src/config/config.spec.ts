// SPDX-FileCopyrightText: 2025-2026 caixw
//
// SPDX-License-Identifier: MIT

import { describe, expect, test } from 'vitest';

import { Config } from './config';

describe('Config', () => {
	const c = new Config('admin', '10');

	test('基本属性', () => {
		expect(c.current).toEqual('10');
		expect(c.prefix).toEqual('admin');
		expect(c.storage).toEqual(window.localStorage);
	});

	test('默认用户', () => {
		expect(c.get('id1')).toBeUndefined();
		c.set('id1', 5);
		expect(c.get('id1')).toEqual(5);
		expect(window.localStorage.getItem('admin--10--id1')).toEqual('5'); // 转换为 JSON 保存的

		c.set('id2', { id: 50 });
		expect(c.get('id2')).toEqual({ id: 50 });
		expect(window.localStorage.getItem('admin--10--id2')).toEqual('{"id":50}'); // 转换为 JSON 保存的

		c.remove('id2');
		expect(c.get('id2')).toBeUndefined();

		c.clear();
		expect(c.get('id1')).toBeUndefined();
		expect(c.get('id3')).toBeUndefined();
	});

	test('切换用户', () => {
		c.set('id2', { id: 50 });

		c.switch('11');

		expect(c.get('id2')).toBeUndefined();

		c.set('id2', { id: 51 });
		expect(c.get('id2')).toEqual({ id: 51 });
		expect(window.localStorage.getItem('admin--11--id2')).toEqual('{"id":51}');
		expect(window.localStorage.getItem('admin--10--id2')).toEqual('{"id":50}'); // 原用户不变
	});
});
