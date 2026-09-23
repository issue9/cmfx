// SPDX-FileCopyrightText: 2026 caixw
//
// SPDX-License-Identifier: MIT

import { renderHook } from '@solidjs/testing-library';
import { createSignal } from 'solid-js';
import { afterAll, describe, expect, test } from 'vitest';

import { StateProvider, useState } from './context';
import type { State } from './state';
import styles from './style.module.css';

describe('StateProvider', () => {
	const [state, setState] = createSignal<State>('enabled');

	const { result, cleanup } = renderHook(() => useState(), {
		wrapper: props => <StateProvider state={state()}>{props.children}</StateProvider>,
	});

	test('enabled', () => {
		expect(result.state).toBe('enabled');
		expect(result.class).toBe(styles.enabled);
	});

	test('disabled', () => {
		setState('disabled');
		expect(result.state).toBe('disabled');
		expect(result.class).toBe(styles.disabled);
	});

	afterAll(cleanup);
});

describe('StateProvider.getClass', () => {
	const [state, setState] = createSignal<State>('enabled');

	const { result, cleanup } = renderHook(() => useState(), {
		wrapper: props => (
			<StateProvider state={state()} getClass={s => `s_${s}`}>
				{props.children}
			</StateProvider>
		),
	});

	test('enabled', () => {
		expect(result.state).toBe('enabled');
		expect(result.class).toBe('s_enabled');
	});

	test('disabled', () => {
		setState('disabled');
		expect(result.state).toBe('disabled');
		expect(result.class).toBe('s_disabled');
	});

	afterAll(cleanup);
});
