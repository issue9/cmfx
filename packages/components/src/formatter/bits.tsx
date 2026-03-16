// SPDX-FileCopyrightText: 2026 caixw
//
// SPDX-License-Identifier: MIT

import type { Locale } from '@cmfx/core';
import { createEffect, createMemo, createSignal, type JSX } from 'solid-js';

import { useLocale } from '@components/context';

const kb = 1024;
const mb = kb * 1024;
const gb = mb * 1024;
const tb = gb * 1024;

// TODO: https://github.com/tc39/ecma402/issues/755
export const units = ['bit', 'kilobit', 'megabit', 'gigabit', 'terabit'] as const;

export type Unit = (typeof units)[number];

export interface BitsProps {
	/**
	 * 需要转换的数值
	 *
	 * @reactive
	 */
	value: number;

	/**
	 * 显示的单位
	 *
	 * @reactive
	 *
	 * @remarks
	 * 如果不为空，则显示该单位的数值，如果为空，则显示为可表示的最大单位。
	 */
	unit?: Unit;
}

/**
 * 位大小的格式化组件
 *
 * @remarks
 * 这是对 {@link createBits} 的封装。
 */
export function Bits(props: BitsProps): JSX.Element {
	const l = useLocale();
	const f = createMemo(() => {
		return createBits(l, props.unit);
	});

	const [val, setVal] = createSignal(props.value);
	createEffect(() => {
		setVal(props.value);
	});

	return <>{f()(val())}</>;
}

/**
 * 创建用于格式化位大小的函数
 *
 * @param l - 本地化接口；
 * @param unit - 单位；
 * @returns 用于格式化的函数，会根据传入的字节大小自动选择合适的单位；
 */
export function createBits(l: Locale, unit?: Unit): (bit: number) => string {
	let style: Intl.NumberFormatOptions['unitDisplay'];

	switch (l.displayStyle) {
		case 'full':
			style = 'long';
			break;
		case 'short':
			style = 'short';
			break;
		case 'narrow':
			style = 'narrow';
			break;
		default:
			style = 'short';
			console.error('参数 u 的类型无效');
	}

	const b = l.numberFormat({ style: 'unit', unit: 'bit', unitDisplay: style });
	const k = l.numberFormat({ style: 'unit', unit: 'kilobit', unitDisplay: style });
	const m = l.numberFormat({ style: 'unit', unit: 'megabit', unitDisplay: style });
	const g = l.numberFormat({ style: 'unit', unit: 'gigabit', unitDisplay: style });
	const t = l.numberFormat({ style: 'unit', unit: 'terabit', unitDisplay: style });

	switch (unit) {
		case 'bit':
			return (bits: number): string => b.format(bits);
		case 'kilobit':
			return (bits: number): string => k.format(bits / kb);
		case 'megabit':
			return (bits: number): string => m.format(bits / mb);
		case 'gigabit':
			return (bits: number): string => g.format(bits / gb);
		case 'terabit':
			return (bits: number): string => t.format(bits / tb);
		default:
			return (bits: number): string => {
				if (bits < kb) {
					return b.format(bits);
				} else if (bits < mb) {
					return k.format(bits / kb);
				} else if (bits < gb) {
					return m.format(bits / mb);
				} else if (bits < tb) {
					return g.format(bits / gb);
				} else {
					return t.format(bits / tb);
				}
			};
	}
}
