// SPDX-FileCopyrightText: 2025 caixw
//
// SPDX-License-Identifier: MIT

import { day, ms } from './duration';

const msOfDay = day / ms;

// 当年 1 月 4 日（保证在第一周）
function jan4(d: Date): number { return new Date(d.getFullYear(), 0, 4).valueOf(); }

// 获取 date 所在周的周四
function getThursday(date: Date): Date {
    const target = new Date(date);
    target.setDate(target.getDate() + 3 - (target.getDay() + 6) % 7); // 调整到周四
    return target;
}

/**
 * 符合 ISO 8601 的周数计算
 */
export function getISOWeek(date: Date): [year: number, week: number] {
    // TODO: Temporal 有 weekOfYear  https://caniuse.com/?search=Temporal

    const target = getThursday(date);
    return [target.getFullYear(), Math.ceil(((target.valueOf() - jan4(target)) / msOfDay + 3) / 7)];
}

/**
 * 获取指定日期所在周的开始日期
 */
export function startOfISOWeek(date: Date): Date {
    const target = getThursday(date);
    target.setDate(target.getDate() - 3);
    return target;
}

/**
 * 获取指定日期所在周的结束日期
 */
export function endOfISOWeek(date: Date): Date {
    const target = getThursday(date);
    target.setDate(target.getDate() + 3);
    return target;
}

/**
 * 获取指定日期所在周的范围
 */
export function getISOWeekRange(date: Date): [Date, Date] {
    const start = startOfISOWeek(date);
    const end = endOfISOWeek(date);
    return [start, end];
}

/**
 * 根据周数找到对应的周的起止日期
 */
export function getISOWeekRangeByWeek(year: number, week: number): ReturnType<typeof getISOWeekRange> {
    const target = new Date(year, 0, 4); // 一月4号必然在第一周
    target.setDate(target.getDate() + (week - 1) * 7);
    return getISOWeekRange(target);
}
