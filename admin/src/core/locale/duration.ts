// SPDX-FileCopyrightText: 2024-2025 caixw
//
// SPDX-License-Identifier: MIT

import '@formatjs/intl-durationformat/polyfill';

const us = 1000;
const ms = 1000 * us;
const second = 1000 * ms;
const minute = 60 * second;
const hour = 60 * minute;
const day = 24 * hour;

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

export function parseDuration(val?: number | string): Intl.DurationInput {
    if (!val) { return { nanoseconds: 0 }; }

    let nano = 0; // 总的纳秒数
    if (typeof(val) === 'string') {
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

                    nano += nameValues.find(item=>item[0]===name)![1] * v;
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
                    nano += nameValues.find(item=>item[0]===name)![1] * v;
                }

                break;
            }
        }
    } else { nano = isNaN(val) ? 0 : val; }

    const obj: Intl.DurationInput = {};
    let hasField = false; // 是否有字段已经设置过值
    for (let i = 1; i < nameValues.length; i++) {
        const curr = nameValues[i];
        const rem = nano % curr[1];
        if (rem) {
            hasField = true;
            const prev = nameValues[i - 1];
            obj[prev[0]] = Math.floor(rem / prev[1]); // Intl.DurationInput 要求必须是整数
            nano -= rem;
        }
        if (!nano) { break; }
    };

    if (!hasField) { obj.nanoseconds = 0; } // 至少需要一个字段

    return obj;
}
