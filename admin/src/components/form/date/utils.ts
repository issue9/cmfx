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
export function monthDays(date: Date, week: Week): Array<[boolean,Month, number, number]> {
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

// 返回 [start, end] 的数组
//
// 如果两者都是零，则返回空值数组。
export function range(start: number, end: number): Array<number> {
    if (start === end) {
        return start === 0 ? [] : [start];
    }
    return Array.from({ length: (end - start + 1) }, (_, k) => k + start);
}

export const monthsLocales = new Map<Month, string>([
    [0, '_internal.datepicker.january'],
    [1, '_internal.datepicker.february'],
    [2, '_internal.datepicker.march'],
    [3, '_internal.datepicker.april'],
    [4, '_internal.datepicker.may'],
    [5, '_internal.datepicker.june'],
    [6, '_internal.datepicker.july'],
    [7, '_internal.datepicker.augest'],
    [8, '_internal.datepicker.september'],
    [9, '_internal.datepicker.october'],
    [10, '_internal.datepicker.november'],
    [11, '_internal.datepicker.december'],
]);

export const weeksLocales = new Map<Week, string>([
    [1, '_internal.datepicker.monday'],
    [2, '_internal.datepicker.tuesday'],
    [3, '_internal.datepicker.wednesday'],
    [4, '_internal.datepicker.thursday'],
    [5, '_internal.datepicker.friday'],
    [6, '_internal.datepicker.saturday'],
    [0, '_internal.datepicker.sunday']
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
