// SPDX-FileCopyrightText: 2025 caixw
//
// SPDX-License-Identifier: MIT

export type RangeValueType = [start?: Date, end?: Date];

/**
 * 获取相对于 date 的上个月
 */
export function prevMonth(date?: Date): RangeValueType {
    const d = getYMD(date);
    return [new Date(d[0], d[1] - 1, 1), new Date(d[0], d[1], 0)];
}

/**
 * 获取相对于 date 的上一个季度
 */
export function prevQuarter(date?: Date): RangeValueType {
    const d = getYMD(date);

    if (d[1] >= 0 && d[1] <= 2) { // Q1
        return [new Date(d[0] - 1, 9, 1), new Date(d[0], 0, 0)];
    } else if (d[1] >= 3 && d[1] <= 5) { // Q2
        return [new Date(d[0], 0, 1), new Date(d[0], 3, 0)];
    } else if (d[1] >= 6 && d[1] <= 8) { // Q3
        return [new Date(d[0], 3, 1), new Date(d[0], 6, 0)];
    } else { // Q4
        return [new Date(d[0], 6, 1), new Date(d[0], 9, 0)];
    }
}

/**
 * 获取相对于 date 的当前季度
 */
export function thisQuarter(date?: Date): RangeValueType {
    const d = getYMD(date);

    if (d[1] >= 0 && d[1] <= 2) { // Q1
        return [new Date(d[0], 0, 1), new Date(d[0], 3, 0)];
    } else if (d[1] >= 3 && d[1] <= 5) { // Q2
        return [new Date(d[0], 3, 1), new Date(d[0], 6, 0)];
    } else if (d[1] >= 6 && d[1] <= 8) { // Q3
        return [new Date(d[0], 6, 1), new Date(d[0], 9, 0)];
    } else { // Q4
        return [new Date(d[0], 9, 1), new Date(d[0] + 1, 0, 0)];
    }
}

/**
 * 获取相对于 date 的下一个季度
 */
export function nextQuarter(date?: Date): RangeValueType {
    const d = getYMD(date);

    if (d[1] >= 0 && d[1] <= 2) { // Q1
        return [new Date(d[0], 3, 1), new Date(d[0], 6, 0)];
    } else if (d[1] >= 3 && d[1] <= 5) { // Q2
        return [new Date(d[0], 6, 1), new Date(d[0], 9, 0)];
    } else if (d[1] >= 6 && d[1] <= 8) { // Q3
        return [new Date(d[0], 9, 1), new Date(d[0]+1, 0, 0)];
    } else { // Q4
        return [new Date(d[0] + 1, 0, 1), new Date(d[0] + 1, 3, 0)];
    }
}

/**
 * 获取相对于 date 的上一年份
 */
export function prevYear(date?: Date): RangeValueType {
    const d = getYMD(date);
    return [new Date(d[0]-1, 0, 1), new Date(d[0], 0, 0)];
}

/**
 * 获取相对于 date 的本年份
 */
export function thisYear(date?: Date): RangeValueType {
    const d = getYMD(date);
    return [new Date(d[0], 0, 1), new Date(d[0] + 1, 0, 0)];
}

/**
 * 获取相对于 date 的下一年份
 */
export function nextYear(date?: Date): RangeValueType {
    const d = getYMD(date);
    return [new Date(d[0] + 1, 0, 1), new Date(d[0] + 2, 0, 0)];
}

function getYMD(date?: Date): [number, number, number] {
    const now = date || new Date();
    return [now.getFullYear(), now.getMonth(), now.getDate()];
}
