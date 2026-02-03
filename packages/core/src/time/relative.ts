// SPDX-FileCopyrightText: 2025-2026 caixw
//
// SPDX-License-Identifier: MIT

import { round } from '@core/math';
import { Duration, day, hour, minute, parseDuration, second } from './duration';

const nameValues: Array<[Intl.RelativeTimeFormatUnit, number]> = [
	['seconds', second],
	['minutes', minute],
	['hours', hour],
	['days', day],
	['weeks', day * 7],
	['months', day * 30],
	['quarters', day * 90],
	['years', day * 365],
] as const;

/**
 * 将纳秒转换为 {@link Intl#RelativeTimeFormat.format} 可用的参数
 * @param nano - 纳秒，如果为负数表示过去的时间；
 */
export function nano2IntlRelative(nano: number): [number, Intl.RelativeTimeFormatUnit] {
	let prevUnit: Intl.RelativeTimeFormatUnit = 'seconds';
	let value = round(nano / second, 2);

	for (let i = 1; i < nameValues.length; i++) {
		const item = nameValues[i];
		let rem = nano / item[1];
		if (Math.abs(rem) < 1) {
			// 只有小数了，则采用前一个元素；
			break;
		} else {
			value = round(rem, 0);
			prevUnit = item[0];
			rem = nano / item[1];
		}
	}

	return [value, prevUnit];
}

/**
 * 将 {@link Duration} 转换为相对时间的字符串
 */
export function formatDuration2RelativeTime(formatter: Intl.RelativeTimeFormat, duration: Duration): string {
	const nano = typeof duration === 'string' ? parseDuration(duration) : duration;
	const [val, unit] = nano2IntlRelative(nano);
	return formatter.format(val, unit);
}
