// SPDX-FileCopyrightText: 2026 caixw
//
// SPDX-License-Identifier: MIT

import { renderHook } from '@solidjs/testing-library';
import { afterAll, describe, expect, test } from 'vitest';

import { Hotkey } from './hotkey';
import { HotkeyProvider, useHotkey } from './provider';

describe('HotkeyProvider', () => {
	const { result, cleanup } = renderHook(() => useHotkey(), {
		wrapper: props => <HotkeyProvider> {props.children}</HotkeyProvider>,
	});

	test('bind', () => {
		expect(result.hasKeys('S', 'control')).toEqual(false);
		result.bind(new Hotkey('s', 'control'), () => {});
		expect(result.hasKeys('S', 'control')).toEqual(true);
	});

	test('unbind', () => {
		result.unbind(new Hotkey('s', 'control'));
		expect(result.hasKeys('s', 'control')).toEqual(false);
	});

	afterAll(cleanup);
});
