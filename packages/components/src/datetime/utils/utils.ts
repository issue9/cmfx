// SPDX-FileCopyrightText: 2024-2025 caixw
//
// SPDX-License-Identifier: MIT

/**
 * 这是星期天，作为计算星期的基准日期。
 */
export function sunday() { return new Date('2024-10-20'); }

/**
 * 月份，与 {@link Date#getMonth} 相同，0 表示一月。
 */
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
 * {@link monthDays} 的返回值类型
 */
interface MonthDays {
    isCurrent: boolean;// 表示是否为当前月份
    year: number; // 年份
    month: Month; // 月份
    start: number; // 该月在当前面板上的起始日期
    end: number; // 该月在当前面板上的结束日期
}

// minDaySize 每个面板最小的日期数量
//
// 需要固定面板高度，底部可能出现一行多余的数据。
export const minDaySize = 41; // 6 行，每行 7 列。

/**
 * 计算指定月份的天数范围
 *
 * @param weekStart 每周的起始；
 * @param date 需要计算的月份；
 * @returns 返回的 {@link MonthDays} 列表；
 */
export function monthDays(date: Date, weekStart: Week): Array<MonthDays> {
    // 当前月的第一天和最后一天
    const firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
    const lastDay = new Date(date.getFullYear(), date.getMonth()+1, 0);
    let count = lastDay.getDate();

    // 处理前一个月份的数据
    const prev: MonthDays = { isCurrent: false, month: 0, start: 0, end: 0, year: 0 };
    const firstWeekDay = firstDay.getDay() as Week;
    if (weekStart !== firstWeekDay) {
        let days = firstWeekDay - weekStart-1; // 需要拿到前一个月需要添加的天数
        if (days < 0) {
            days = weeks.length + days;
        }
        const lastDay = new Date(date.getFullYear(), date.getMonth(), 0);
        const last = lastDay.getDate();
        prev.month = lastDay.getMonth() as Month;
        prev.start = last - days;
        prev.end = last;
        prev.year = lastDay.getFullYear();

        count += days;
    }

    // 处理后一个月份的数据
    const next: MonthDays = { isCurrent: false, month: 0, start: 0, end: 0, year: 0 };
    const lastWeekDay = lastDay.getDay() as Week;
    if (weekDay(weekStart,-1) !== lastWeekDay || count < minDaySize) {
        let days = weekStart - 1 - lastWeekDay;
        if (days <= 0) {
            days = weeks.length + days;
        }
        count += days;
        if (count < minDaySize) {
            days += 7;
        }

        const d = new Date(date.getFullYear(), date.getMonth() + 1, 1);
        next.month = d.getMonth() as Month;
        next.start = 1;
        next.end = days;
        next.year = d.getFullYear();
    }

    const curr: MonthDays = {
        isCurrent: true,
        month: lastDay.getMonth() as Month,
        start: 1,
        end: lastDay.getDate(),
        year: lastDay.getFullYear(),
    };
    return [prev, curr, next];
}

/**
 * 将由 {@link monthDays} 的结果转换为以 7 天为一组的天数据
 */
export function getWeekDays(m: Array<MonthDays>, min?: Date, max?: Date): Array<Array<[boolean, Date]>> {
    const days: Array<[boolean, Date]> = [];
    for (const mm of m) {
        if (mm.start === 0 && mm.start === mm.end) { continue; }

        for (let i = mm.start; i <= mm.end; i++) {
            let enabled = mm.isCurrent;
            const now = new Date(mm.year, mm.month, i);

            if (min && min > now) {
                enabled = false;
            }
            if (max && max < now) {
                enabled = false;
            }

            days.push([enabled, now]);
        }
    }

    // 将天以 7 为单位进行分割并存入 weeks
    const weeks: Array<Array<[boolean, Date]>> = [];
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
 * @returns 以 7 天为一组的数据，每个元素包含以下字段：
 *  - 0 是否为禁用；
 *  - 1 表示当前的日期，仅精确到天；
 */
export function weekDays(date: Date, weekStart: Week, min?: Date, max?: Date): Array<Array<[enabled: boolean, date: Date]>> {
    return getWeekDays(monthDays(date, weekStart), min, max);
}

/**
 * 比较日期是否相等，仅比较日期部分。
 */
export function equalDate(date1: Date, date2: Date): boolean {
    return date1.getFullYear() === date2.getFullYear() &&
        date1.getMonth() === date2.getMonth() &&
        date1.getDate() === date2.getDate();
}

/**
 * 比较 d1 是否大于 d2，仅比较日期部分的大小。
 */
export function compareDate(d1: Date, d2: Date): number {
    return d1.getFullYear() === d2.getFullYear()
        ? d1.getMonth() === d2.getMonth()
            ? d1.getDate() - d2.getDate()
            : d1.getMonth() - d2.getMonth()
        : d1.getFullYear() - d2.getFullYear();
}
