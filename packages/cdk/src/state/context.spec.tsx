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

// 自定义类型
describe('StateProvider.custom-state', () => {
	type S = State | 'loading' | 'not-allowed';

	const [state, setState] = createSignal<S>('disabled');

	const { result, cleanup } = renderHook(() => useState<S>(), {
		wrapper: props => (
			<StateProvider
				state={state()}
				getClass={v => {
					switch (v) {
						case 'loading':
							return 's_loading';
					}
				}}
			>
				{props.children}
			</StateProvider>
		),
	});

	test('enabled', () => {
		setState('enabled');
		expect(result.state).toBe('enabled');
		expect(result.class).toBe(styles.enabled);
	});

	test('disabled', () => {
		setState('disabled');
		expect(result.state).toBe('disabled');
		expect(result.class).toBe(styles.disabled);
	});

	// 自定义类型
	test('loading', () => {
		setState('loading');
		expect(result.state).toBe('loading');
		expect(result.class).toBe('s_loading');
	});

	// 自定义类型，未处理 class
	test('not-allowed', () => {
		setState('not-allowed');
		expect(result.state).toBe('not-allowed');
		expect(result.class).toBeUndefined();
	});

	// 自定义类型，只影响类型系统
	test('no-type', () => {
		setState('no-type' as S);
		expect(result.state).toBe('no-type');
		expect(result.class).toBeUndefined();
	});

	afterAll(cleanup);
});
