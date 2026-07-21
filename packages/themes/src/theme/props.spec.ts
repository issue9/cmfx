// SPDX-FileCopyrightText: 2025-2026 caixw
//
// SPDX-License-Identifier: MIT

import { describe, expect, test } from 'vitest';

import { style2String } from './props';

describe('style2String', () => {
	test('empty', () => {
		expect(style2String()).toEqual('');
	});

	test('str', () => {
		expect(style2String('color:red')).toEqual('color:red;');
	});

	test('str undefined', () => {
		expect(style2String('color:red', undefined)).toEqual('color:red;');
	});

	test('str str', () => {
		expect(style2String('color:red', 'background-color:blue')).toEqual('color:red;background-color:blue;');
	});

	test('obj', () => {
		expect(style2String({ color: 'red' })).toEqual('color:red;');
	});

	test('obj undefined', () => {
		expect(style2String({ color: 'red', 'background-color': 'blue' }, undefined)).toEqual(
			'color:red;background-color:blue;',
		);
	});

	test('obj obj', () => {
		expect(style2String({ color: 'red' }, { 'background-color': 'blue' })).toEqual('color:red;background-color:blue;');
	});

	test('obj undefined obj', () => {
		expect(style2String({ color: 'red' }, undefined, { 'background-color': 'blue' })).toEqual(
			'color:red;background-color:blue;',
		);
	});

	test('obj str', () => {
		expect(style2String({ color: 'red' }, 'background-color:blue')).toEqual('color:red;background-color:blue;');
	});

	test('str obj', () => {
		expect(style2String('color:red', { 'background-color': 'blue' })).toEqual('color:red;background-color:blue;');
	});
});
