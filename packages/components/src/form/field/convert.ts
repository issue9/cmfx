// SPDX-FileCopyrightText: 2026 caixw
//
// SPDX-License-Identifier: MIT

import type { Converter } from '@cmfx/core';
import { createEffect, createSignal } from 'solid-js';

import type { ValueProps } from '@components/base';

/**
 * 将 {@link ValueProps} 从一个类型转换为另一个类型
 *
 * @remarks
 * 在某些情况下很有用，比如与时间相关的组件，在内部实现时可以只处理 Date 类型，
 * 之后再通过本方法处理 string 和 number 类型。
 *
 * @param conv 转换接口；
 * @param props 原始数据；
 * @returns 转换后的数据；
 */
export function convert<T, F>(conv: Converter<T | undefined, F | undefined>, props: ValueProps<T>): ValueProps<F>;
export function convert<T, F>(
	conv: Converter<T | undefined, F | undefined>,
	props?: ValueProps<T>,
): ValueProps<F> | undefined;
export function convert<T, F>(
	conv: Converter<T | undefined, F | undefined>,
	props?: ValueProps<T>,
): ValueProps<F> | undefined {
	if (!props) {
		return undefined;
	}

	const [value, setValue] = createSignal<F | undefined>(conv.from(props.value));

	createEffect(() => setValue(() => conv.from(props.value)));

	return {
		value: value(),
		onChange: (v, o) => {
			if (props.onChange) {
				props.onChange(conv.to(v), conv.to(o));
			}
		},
	};
}

export class Array2StringConverter implements Converter<Array<string> | undefined, string | undefined> {
	from(s?: string[]): string | undefined {
		if (s) {
			return s.join('\n');
		}
	}

	to(s?: string): Array<string> | undefined {
		if (s) {
			return s.split('\n');
		}
	}
}

export class String2DateConverter implements Converter<string | undefined, Date | undefined> {
	from(f?: string): Date | undefined {
		if (f) {
			return new Date(f);
		}
	}

	to(t?: Date): string | undefined {
		if (t) {
			return t.toISOString();
		}
	}
}

export class Number2DateConverter implements Converter<number | undefined, Date | undefined> {
	readonly #milliseconds?: boolean;

	/**
	 * 构造函数
	 *
	 * @param milliseconds 是否以转换为以毫秒保存的数值，默认为秒
	 */
	constructor(milliseconds?: boolean) {
		this.#milliseconds = milliseconds;
	}

	from(f?: number): Date | undefined {
		if (f) {
			return new Date(this.#milliseconds ? f : f * 1000);
		}
	}

	to(t?: Date): number | undefined {
		if (t) {
			const tt = t.getTime();
			return this.#milliseconds ? tt : tt / 1000;
		}
	}
}
