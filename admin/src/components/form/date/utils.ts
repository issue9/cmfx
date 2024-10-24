// SPDX-FileCopyrightText: 2024 caixw
//
// SPDX-License-Identifier: MIT

import { Options } from '@/components/form/types';

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
 * @param weekStart 每周的起始；
 * @param date 需要计算的月份；
 * @returns 返回的元组列表，每个元组包含以下四个字段：
 *  - 0 boolean 表示是否为当前月份;
 *  - 1 Month 月份；
 *  - 2 该月在当前面板上的起始日期；
 *  - 3 该月在当前面板上的结束日期；
 */
export function monthDays(date: Date, weekStart: Week): Array<[boolean, Month, number, number]> {
    // 当前月的第一天和最后一天
    const firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
    const lastDay = new Date(date.getFullYear(), date.getMonth()+1, 0);

    // 处理前一个月份的数据
    let prev: [boolean, Month, number, number] = [false, 0, 0, 0];
    const firstWeekDay = firstDay.getDay() as Week;
    if (weekStart !== firstWeekDay) {
        let days = firstWeekDay - weekStart-1; // 需要拿到前一个月需要添加的天数
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
    if (weekDay(weekStart,-1) !== lastWeekDay) {
        let days = weekStart - 1 - lastWeekDay;
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
export function getWeekDays(m: Array<[boolean, Month, number, number]>): Array<Array<[boolean, Month, number]>> {
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

/**
 * 将 date 所在的月份以及前后一星期以 7 天为一组进行分组
 *
 * @param date 需要计算的月份；
 * @param weekStart 每周的起始；
 * @returns 以 7 为一组的数据，每个元素包含以下三个字段：
 *  - 0 是否为禁用；
 *  - 1 月份；
 *  - 2 在当前月份中的日期；
 */
export function weekDays(date: Date, weekStart: Week): Array<Array<[boolean, Month, number]>> {
    return getWeekDays(monthDays(date, weekStart));
}

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
