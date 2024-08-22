// SPDX-FileCopyrightText: 2024 caixw
//
// SPDX-License-Identifier: MIT

import { Options } from '../types';

export const months = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11] as const;

export type Month = typeof months[number];

/**
 * 表示星期的数值，0 表示周日。
 */
export const weeks = [0, 1, 2, 3, 4, 5, 6] as const;

export type Week = typeof weeks[number];

/**
 * 计算 base + delta 属于周几
 */
export function weekDay(base: Week, delta?: number): Week {
    if (!delta) { return base; }

    delta = delta % weeks.length;
    const v = base + delta;

    if (delta < 0) {
        return v < 0 ? (v + weeks.length) as Week : v as Week;
    }
    return v >=weeks.length ? (v - weeks.length) as Week : v as Week;
}

/**
 * 格式化日期
 */
export function formatDate(d: Date, time?: boolean): string {
    const date = `${d.getFullYear()}-${padNumber(d.getMonth() + 1, 2)}-${padNumber(d.getDate(), 2)}`;
    if (!time) {
        return date;
    }
    return date + `T${padNumber(d.getHours(), 2)}:${padNumber(d.getMinutes(), 2)}:${padNumber(d.getSeconds(), 2)}`;
}

function padNumber(n: number, len: number): string { return n.toString().padStart(len, '0'); }

/**
 * 计算指定月份的天数范围
 *
 * @param week 起始的星期；
 * @param date 需要计算天的月份；
 * @returns 返回的元组列表，每个元组包含以下四个字段：
 *  - 0 boolean 表示是否为当前月份;
 *  - 1 Month 月份；
 *  - 2 该月在当前面板上的起始日期；
 *  - 3 该月在当前面板上的结束日期；
 */
export function monthDays(date: Date, week: Week): Array<[boolean, Month, number, number]> {
    // 当前月的第一天和最后一天
    const firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
    const lastDay = new Date(date.getFullYear(), date.getMonth()+1, 0);

    // 处理前一个月份的数据
    let prev: [boolean, Month, number, number] = [false, 0, 0, 0];
    const firstWeekDay = firstDay.getDay() as Week;
    if (week !== firstWeekDay) {
        let days = firstWeekDay - week-1; // 需要拿到前一个月需要添加的天数
        if (days < 0) {
            days = weeks.length + days;
        }
        const lastDay = new Date(date.getFullYear(), date.getMonth(), 0);
        const last = lastDay.getDate();
        prev = [false, lastDay.getMonth() as Month, last - days, last];
    }

    // 处理后一个月份的数据
    let next: [boolean, Month, number, number] = [false, 0, 0, 0];
    const lastWeekDay = lastDay.getDay() as Week;
    if (weekDay(week,-1) !== lastWeekDay) {
        let days = week - 1 - lastWeekDay;
        if (days <= 0) {
            days = weeks.length + days;
        }
        next = [false, (new Date(date.getFullYear(), date.getMonth()+1,1)).getMonth() as Month, 1, days];
    }

    return [prev, [true,lastDay.getMonth() as Month, 1, lastDay.getDate()], next];
}

/**
 * 将由 {@link monthDays} 的结果转换为以 7 天为一组的天数据
 */
export function weekDays(m: Array<[boolean, Month, number, number]>): Array<Array<[boolean, Month, number]>> {
    const days: Array<[boolean, Month, number]> = [];
    for (const mm of m) {
        if (mm[2] === 0 && mm[2] === mm[3]) { continue; }

        for (let i = mm[2]; i <= mm[3]; i++) {
            days.push([mm[0], mm[1], i]);
        }
    }

    const weeks: Array<Array<[boolean, Month, number]>> = [];
    for (let i = 0; i < days.length; i += 7) {
        weeks.push(days.slice(i, i + 7));
    }
    return weeks;
}

export const monthsLocales = new Map<Month, string>([
    [0, '_internal.date.january'],
    [1, '_internal.date.february'],
    [2, '_internal.date.march'],
    [3, '_internal.date.april'],
    [4, '_internal.date.may'],
    [5, '_internal.date.june'],
    [6, '_internal.date.july'],
    [7, '_internal.date.august'],
    [8, '_internal.date.september'],
    [9, '_internal.date.october'],
    [10, '_internal.date.november'],
    [11, '_internal.date.december'],
]);

export const weeksLocales = new Map<Week, string>([
    [1, '_internal.date.monday'],
    [2, '_internal.date.tuesday'],
    [3, '_internal.date.wednesday'],
    [4, '_internal.date.thursday'],
    [5, '_internal.date.friday'],
    [6, '_internal.date.saturday'],
    [0, '_internal.date.sunday']
]);

export const hoursOptions: Options<number> = [
    [0, '00'],
    [1, '01'],
    [2, '02'],
    [3, '03'],
    [4, '04'],
    [5, '05'],
    [6, '06'],
    [7, '07'],
    [8, '08'],
    [9, '09'],
    [10, '10'],
    [11, '11'],
    [12, '12'],
    [13, '13'],
    [14, '14'],
    [15, '15'],
    [16, '16'],
    [17, '17'],
    [18, '18'],
    [19, '19'],
    [20, '20'],
    [21, '21'],
    [22, '22'],
    [23, '23'],
];

export const minutesOptions: Options<number> = [
    [0, '00'],
    [1, '01'],
    [2, '02'],
    [3, '03'],
    [4, '04'],
    [5, '05'],
    [6, '06'],
    [7, '07'],
    [8, '08'],
    [9, '09'],
    [10, '10'],
    [11, '11'],
    [12, '12'],
    [13, '13'],
    [14, '14'],
    [15, '15'],
    [16, '16'],
    [17, '17'],
    [18, '18'],
    [19, '19'],
    [20, '20'],
    [21, '21'],
    [22, '22'],
    [23, '23'],
    [24, '24'],
    [25, '25'],
    [26, '26'],
    [27, '27'],
    [28, '28'],
    [29, '29'],
    [30, '30'],
    [31, '31'],
    [32, '32'],
    [33, '33'],
    [34, '34'],
    [35, '35'],
    [36, '36'],
    [37, '37'],
    [38, '38'],
    [39, '39'],
    [40, '40'],
    [41, '41'],
    [42, '42'],
    [43, '43'],
    [44, '44'],
    [45, '45'],
    [46, '46'],
    [47, '47'],
    [48, '48'],
    [49, '49'],
    [50, '50'],
    [51, '51'],
    [52, '52'],
    [53, '53'],
    [54, '54'],
    [55, '55'],
    [56, '56'],
    [57, '57'],
    [58, '58'],
    [59, '59'],
];
