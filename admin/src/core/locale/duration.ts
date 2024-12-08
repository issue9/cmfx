// SPDX-FileCopyrightText: 2024 caixw
//
// SPDX-License-Identifier: MIT

import '@formatjs/intl-durationformat/polyfill';
import { DurationInput as DI, DurationFormatOptions as DFO, DurationFormat as DF } from '@formatjs/intl-durationformat/src/types';

import { divide } from '@/core/math';

// TODO: DurationFormat 上线之后可删除。
// https://caniuse.com/?search=durationformat
declare global {
    namespace Intl {
        type DurationFormat = DF;
        type DurationFormatOptions = DFO;
        type DurationInput = DI;
    }
}

const ns = 1;
const us = 1000 * ns;
const ms = 1000 * us;
const second = 1000 * ms;
const minute = 60 * second;
const hour = 60 * minute;
const day = 24 * hour;

// https://cs.opensource.google/go/go/+/refs/tags/go1.23.1:src/time/format.go;l=1601
const strMap: ReadonlyMap<string, keyof Intl.DurationInput> = new Map([
    ['ns', 'nanoseconds'],
    ['us', 'microseconds'],
    ['µs', 'microseconds'], // U+00B5 = micro symbol
    ['μs', 'microseconds'], // U+03BC = Greek letter mu
    ['ms', 'milliseconds'],
    ['s', 'seconds'],
    ['m', 'minutes'],
    ['h', 'hours'],
]);

const durations: Array<[number, keyof Intl.DurationInput]> = [
    [day, 'days'],
    [hour, 'hours'],
    [minute, 'minutes'],
    [second, 'seconds'],
    [ms, 'milliseconds'],
    [us, 'microseconds'],
    [1, 'nanoseconds'],
] as const;

export function parseDuration(val?: number | string): Intl.DurationInput {
    if (!val) { return { nanoseconds: 0 }; }

    if (typeof val === 'string') {
        if (isNaN(Number(val))) {
            return parseString(val);
        }

        val = parseInt(val);
    }

    const opt: Intl.DurationInput = {};

    for(const d of durations) {
        if (val > d[0]) {
            const [q, r] = divide(val, d[0]);
            val = r;
            opt[d[1]] = q;

            if (r === 0) { break; }
        }
    }
    return opt;
}

function parseString(val: string): Intl.DurationInput {
    const dur: Intl.DurationInput = {};

    let start = 0;
    let v: number = 0;
    let isNum = true;
    for (let i = 0; i < val.length;i++) {
        const code = val.charCodeAt(i);

        if (code < 48 || code > 57) {
            if (isNum) {
                v = parseInt(val.slice(start, i));
                start = i;
                isNum = false;
            }
        } else {
            if (!isNum) {
                const item = strMap.get(val.slice(start, i));
                if (item === undefined) {
                    throw `无法解析的单位名称 ${val.slice(start, i)}`;
                }

                dur[item] = v;
                start = i;
                isNum = true;
            }
        }

        if  (i >= val.length-1) {
            const last = val.slice(start, val.length);

            if (isNum) {
                dur['nanoseconds'] = parseInt(last);
            } else {
                const item = strMap.get(last);
                if (item === undefined) {
                    throw `无法解析的单位名称 ${last}`;
                }

                dur[item] = v;
            }
            break;
        }
    }

    return dur;
}
