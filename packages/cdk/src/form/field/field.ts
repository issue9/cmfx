// SPDX-FileCopyrightText: 2026 caixw
//
// SPDX-License-Identifier: MIT

import type { ChangeFunc, FormState } from '@cmfx/cdk';
import equal from 'fast-deep-equal';
import { createSignal, createUniqueId, type JSX, untrack } from 'solid-js';

import type { FormField } from '@cdk/form/types';

/**
 * 手动创建一个 FormField 对象
 *
 * @param initValue - 初始值；
 * @param onChange - 值变化时的回调函数，也可在之后通过返回对象的 onChange 方法添加；
 */
export function createFormField<T>(initValue?: T, onChange?: ChangeFunc<T | undefined>): FormField<T> {
	const preset = structuredClone(initValue);
	const [v, sv] = createSignal<T | undefined>(initValue);
	const [extra, setExtra] = createSignal<JSX.Element | undefined>();
	const [err, setErr] = createSignal<string | undefined>();
	const id = createUniqueId();
	const [state, setState] = createSignal<FormState>('enabled');

	const changes: Array<ChangeFunc<T | undefined>> = [];
	if (onChange) {
		changes.push(onChange);
	}

	const setValue = (val: T | undefined, silent?: boolean) => {
		const old = untrack(v);

		if (equal(old, val)) {
			return;
		}

		sv(() => val);

		setErr(); // 取消错误信息

		if (!silent) {
			for (const f of changes) {
				f(val, old);
			}
		}
	};

	return {
		id,
		name: id,

		reset: (silent?: boolean) => setValue(structuredClone(preset), silent),

		setError: setErr,
		getError: err,

		getState: state,
		setState: setState,

		getValue: v,
		setValue: setValue,
		onChange: (cb: ChangeFunc<T | undefined>) => changes.push(cb),

		getExtra: extra,
		setExtra: setExtra,
	};
}
