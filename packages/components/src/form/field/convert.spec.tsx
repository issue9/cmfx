// SPDX-FileCopyrightText: 2026 caixw
//
// SPDX-License-Identifier: MIT

import { createSignal } from 'solid-js';
import { describe, expect, test } from 'vitest';

import { Array2StringConverter, convert, Number2DateConverter, String2DateConverter } from './convert';

describe('convert', () => {
	const now = new Date();
	const nowT = now.getTime();
	const conv = new Number2DateConverter(true);

	test('undefined', () => {
		const p = convert<number, Date>(conv, undefined);
		expect(p).toBeUndefined();
	});

	test('Number2DateConverter', () => {
		const [val, setVal] = createSignal<number | undefined>(5);
		let v: number | undefined;

		const p = convert<number, Date>(conv, {
			value: val(),
			onChange: val => {
				setVal(val);
				v = val;
			},
		});

		expect(p).toBeDefined();
		expect(p.value).toEqual(new Date(5));
		p.onChange?.(now);
		expect(v).toEqual(nowT);
	});
});

describe('Array2StringConverter', () => {
	const s = '1\n2\n\n4';
	const a = ['1', '2', '', '4'];
	const conv = new Array2StringConverter();

	test('from', () => {
		expect(conv.from(a)).toEqual(s);
	});

	test('to', () => {
		expect(conv.to(s)).toEqual(a);
	});
});

describe('String2DateConverter', () => {
	const now = new Date();
	const nowS = now.toISOString();
	const conv = new String2DateConverter();

	test('from', () => {
		expect(conv.from(nowS)).toEqual(now);
	});

	test('to', () => {
		expect(conv.to(now)).toEqual(nowS);
	});
});

describe('Number2DateConverter', () => {
	const now = new Date();
	const nowT = now.getTime();

	test('milliseconds=true', () => {
		const conv = new Number2DateConverter(true);

		expect(conv.from(nowT)!.getTime()).toBe(now.getTime());
		expect(conv.to(now)).toBe(nowT);
	});

	test('milliseconds=false', () => {
		const nowS = nowT / 1000;
		const conv = new Number2DateConverter();

		expect(conv.from(nowS)!.getTime()).toBe(now.getTime());
		expect(conv.to(now)).toBe(nowS);
	});
});
