// SPDX-FileCopyrightText: 2024-2026 caixw
//
// SPDX-License-Identifier: MIT

import { describe, expect, test } from 'vitest';

import { Hotkey, modifierCodes } from './hotkey';

describe('HotKey', () => {
	Hotkey.init();
	Hotkey.init(); // 多次调用

	test('static', async () => {
		expect(Hotkey.hasKeys('f', 'control')).toBe(false);

		Hotkey.bindKeys(() => {}, 'f', 'control');
		expect(Hotkey.hasKeys('f', 'control')).toBe(true);

		expect(() => Hotkey.bindKeys(() => {}, 'f', 'control')).toThrow('快捷键 control+f 已经存在');

		Hotkey.unbind(new Hotkey('F', 'control'));
		expect(Hotkey.hasKeys('f', 'control')).toBe(false);
	});

	test('construct', () => {
		expect(() => new Hotkey('F', 'shift', 'shift')).toThrow('重复的修饰符 shift');

		let hk = new Hotkey('F', 'shift');
		expect(hk.key).toEqual('F');
		expect(hk.modifiers).toEqual(modifierCodes.get('shift'));

		hk = new Hotkey('f', 'shift', 'meta');
		expect(hk.key).toEqual('f');
		expect(hk.modifiers).toEqual(modifierCodes.get('shift')! + modifierCodes.get('meta')!);
	});

	test('match', () => {
		const hk = new Hotkey('F', 'shift', 'meta');

		expect(hk.match(new KeyboardEvent('keydown', { code: 'KeyF', shiftKey: true, metaKey: true }))).toBe(true);

		expect(hk.match(new KeyboardEvent('keydown', { code: 'KeyF', metaKey: true }))).toBe(false);
		expect(
			hk.match(new KeyboardEvent('keydown', { code: 'KeyF', shiftKey: true, metaKey: true, altKey: true })),
		).toBeFalsy();
	});

	test('keys', () => {
		let hk = new Hotkey('F', 'shift', 'meta');
		expect(hk.keys()).toEqual(['meta', 'shift', 'F']);

		hk = new Hotkey('f', 'shift');
		expect(hk.keys()).toEqual(['shift', 'f']);
	});

	test('toString', () => {
		const hk = new Hotkey('F', 'shift', 'meta');
		expect(hk.toString()).toEqual('meta+shift+F');
	});

	Hotkey.destroy();
	Hotkey.destroy(); // 多次调用
});
