// SPDX-FileCopyrightText: 2025-2026 caixw
//
// SPDX-License-Identifier: MIT

import { renderHook } from '@solidjs/testing-library';
import { createSignal } from 'solid-js';
import { createStore } from 'solid-js/store';
import { afterAll, describe, expect, test } from 'vitest';

import { schemes } from '@themes/schemes';
import type { Mode, Scheme } from '@themes/theme';
import { applyTheme, hasTheme, type Theme, ThemeProvider, useTheme } from './theme';

test('theme', () => {
	let t: Theme = { scheme: schemes.green, mode: 'light' };

	let div = document.createElement('div');
	applyTheme(div, t);
	expect(hasTheme(div)).toBeTruthy();

	t = { scheme: schemes.green, mode: 'dark' };
	expect(t.mode).toEqual('dark');

	div = document.createElement('div');
	applyTheme(div, t);
	expect(hasTheme(div)).toBeTruthy();
});

describe('context', () => {
	const [mode, setMode] = createSignal<Mode>('light');
	const [scheme, setScheme] = createStore<Scheme>(schemes.green);

	const { result, cleanup } = renderHook(() => useTheme(), {
		wrapper: props => (
			<ThemeProvider mode={mode()} scheme={scheme}>
				{' '}
				{props.children}
			</ThemeProvider>
		),
	});

	test('mode', () => {
		expect(result.mode).toEqual('light');

		setMode('dark');
		expect(result.mode).toEqual('dark');
	});

	test('scheme', () => {
		expect(result.scheme.primary).toEqual(schemes.green.primary);
		setScheme('primary', 'green');
		expect(result.scheme.primary).toEqual('green');
	});

	test('scheme.radius', () => {
		expect(result.scheme.radius).toEqual(schemes.green.radius);
		setScheme('radius', 'lg', 55);
		expect(result.scheme.radius.lg).toEqual(55);
	});

	test('scheme.vars', () => {
		expect(result.scheme.vars?.['--color']).toBeUndefined();

		setScheme('vars', { '--color': 'red' });
		expect(result.scheme.vars?.['--color']).toEqual('red');

		setScheme('vars', '--color', 'green');
		expect(result.scheme.vars?.['--color']).toEqual('green');
	});

	afterAll(cleanup);
});
