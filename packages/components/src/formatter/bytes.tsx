// SPDX-FileCopyrightText: 2025-2026 caixw
//
// SPDX-License-Identifier: MIT

import type { Locale } from '@cmfx/core';
import { createEffect, createMemo, createSignal, type JSX } from 'solid-js';

import { useLocale } from '@components/context';
import { buildPerUnit } from './utils';

const kb = 1024;
const mb = kb * 1024;
const gb = mb * 1024;
const tb = gb * 1024;
const pb = tb * 1024;

export const units = ['byte', 'kilobyte', 'megabyte', 'gigabyte', 'terabyte', 'petabyte'] as const;

export type Unit = (typeof units)[number];

export interface BytesProps {
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

	/**
	 * 与 unit 组成一个 unit/per 格式的单位，比如 1mb/second 等
	 *
	 * @reactive
	 */
	per?: string;
}

/**
 * 字节大小的格式化组件
 *
 * @remarks
 * 这是对 {@link createBytes} 的封装。
 */
export function Bytes(props: BytesProps): JSX.Element {
	const l = useLocale();

	const f = createMemo(() => {
		return createBytes(l, props.unit, props.per);
	});

	const [val, setVal] = createSignal(props.value);
	createEffect(() => {
		setVal(props.value);
	});

	return <>{f()(val())}</>;
}

/**
 * 创建用于格式化字节大小的函数
 *
 * @param l - 本地化接口；
 * @param unit - 单位；
 * @param per - 与 unit 组成一个 unit/per 格式的单位，比如 1mb/second 等；
 * @returns 用于格式化的函数，会根据传入的字节大小自动选择合适的单位；
 */
export function createBytes(l: Locale, unit?: Unit, per?: string): (byte: number) => string {
	if (per && units.includes(per as Unit)) {
		throw new TypeError('per 不能是字节单位');
	}

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

	const b = l.numberFormat({ style: 'unit', unit: buildPerUnit('byte', per), unitDisplay: style });
	const k = l.numberFormat({ style: 'unit', unit: buildPerUnit('kilobyte', per), unitDisplay: style });
	const m = l.numberFormat({ style: 'unit', unit: buildPerUnit('megabyte', per), unitDisplay: style });
	const g = l.numberFormat({ style: 'unit', unit: buildPerUnit('gigabyte', per), unitDisplay: style });
	const t = l.numberFormat({ style: 'unit', unit: buildPerUnit('terabyte', per), unitDisplay: style });
	const p = l.numberFormat({ style: 'unit', unit: buildPerUnit('petabyte', per), unitDisplay: style });

	switch (unit) {
		case 'byte':
			return (bytes: number): string => b.format(bytes);
		case 'kilobyte':
			return (bytes: number): string => k.format(bytes / kb);
		case 'megabyte':
			return (bytes: number): string => m.format(bytes / mb);
		case 'gigabyte':
			return (bytes: number): string => g.format(bytes / gb);
		case 'terabyte':
			return (bytes: number): string => t.format(bytes / tb);
		case 'petabyte':
			return (bytes: number): string => p.format(bytes / pb);
		default:
			return (bytes: number): string => {
				if (bytes < kb) {
					return b.format(bytes);
				} else if (bytes < mb) {
					return k.format(bytes / kb);
				} else if (bytes < gb) {
					return m.format(bytes / mb);
				} else if (bytes < tb) {
					return g.format(bytes / gb);
				} else if (bytes < pb) {
					return t.format(bytes / tb);
				} else {
					return p.format(bytes / pb);
				}
			};
	}
}
