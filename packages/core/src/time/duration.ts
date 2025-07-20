// SPDX-FileCopyrightText: 2024-2025 caixw
//
// SPDX-License-Identifier: MIT

import '@formatjs/intl-durationformat/polyfill';

export type Duration = number | string;

export const us = 1000;
export const ms = 1000 * us;
export const second = 1000 * ms;
export const minute = 60 * second;
export const hour = 60 * minute;
export const day = 24 * hour;

const nameValues: Array<[keyof Intl.DurationInput, number]> = [
    ['nanoseconds', 1],
    ['microseconds', us],
    ['milliseconds', ms],
    ['seconds', second],
    ['minutes', minute],
    ['hours', hour],
    ['days', day],
] as const;

// https://cs.opensource.google/go/go/+/refs/tags/go1.23.1:src/time/format.go;l=1601
const unitNames: ReadonlyMap<string, keyof Intl.DurationInput> = new Map([
    ['ns', 'nanoseconds'],
    ['us', 'microseconds'],
    ['µs', 'microseconds'], // U+00B5 = micro symbol
    ['μs', 'microseconds'], // U+03BC = Greek letter mu
    ['ms', 'milliseconds'],
    ['s', 'seconds'],
    ['m', 'minutes'],
    ['h', 'hours'],
]);

/**
 * parseDuration 将由 Go 语言的 Duration 字符串转换为纳秒
 */
export function parseDuration(val?: Duration): number {
    if (!val) { return 0; }

    if (typeof(val) === 'string') {
        let nano = 0; // 总的纳秒数
        let isNum = true;
        let start = 0;
        let v = 0;
        for (let i = 0; i < val.length;i++) {
            const code = val.charCodeAt(i);
            if ((code < 48 || code > 57) && code !== 46) { // 碰到第一个非数值类型的字符
                if (isNum) {
                    v = parseFloat(val.slice(start, i));
                    start = i;
                    isNum = false;
                }
            } else {
                if (!isNum) {
                    const name = unitNames.get(val.slice(start, i));
                    if (name === undefined) { throw `无法解析的单位名称 ${val.slice(start, i)}`; }

                    nano += Math.round(nameValues.find(item=>item[0]===name)![1] * v); // 防止 .99999 之类的小数位
                    start = i;
                    isNum = true;
                    v = 0;
                }
            }

            if  (i >= val.length-1) { // 最后一个元素
                const last = val.slice(start, val.length);
                if (isNum) {
                    nano += parseInt(last); // 必然是整数
                } else {
                    const name = unitNames.get(last);
                    if (name === undefined) { throw `无法解析的单位名称 ${last}`; }
                    nano += Math.round(nameValues.find(item=>item[0]===name)![1] * v); // 防止 .99999 之类的小数位
                }

                break;
            }
        }
        return nano;
    }

    return isNaN(val) ? 0 : Math.round(val);
}

/**
 * 将纳秒转换为 {@link Intl#DurationInput} 类型
 *
 * 该值可用于 Intl.DurationFormat.format 方法。
 */
export function toIntlDuration(nano: number): Intl.DurationInput {
    const obj: Intl.DurationInput = {};
    let hasField = false; // 是否有字段已经设置过值
    for (let i = 1; i < nameValues.length; i++) {
        const curr = nameValues[i];
        const rem = nano % curr[1];
        if (rem) {
            hasField = true;
            const prev = nameValues[i - 1];
            obj[prev[0]] = Math.round(rem / prev[1]); // Intl.DurationInput 要求必须是整数
            nano -= rem;
        }
        if (!nano) { break; }
    }

    if (!hasField) { obj.nanoseconds = 0; } // 至少需要一个字段

    return obj;
}

/**
 * 格式化 {@link Duration} 对象
 */
export function formatDuration(formatter: Intl.DurationFormat, duration: Duration): string {
    const nano = typeof duration === 'string' ? parseDuration(duration) : duration;
    return formatter.format(toIntlDuration(nano));
}
