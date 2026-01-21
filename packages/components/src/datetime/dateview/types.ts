// SPDX-FileCopyrightText: 2025-2026 caixw
//
// SPDX-License-Identifier: MIT

import { getISOWeek } from '@cmfx/core';

import { BaseProps } from '@components/base';
import { DatetimePlugin } from '@components/datetime/plugin';
import { Week } from '@components/datetime/utils';

/**
 * 用于表示周数，第一个元素为年份，第二个元素为在该年份中的周数。
 */
export type WeekValueType = ReturnType<typeof getISOWeek>;

export interface Ref {
    /**
     * 为指定日期所在的 td 元素添加 {@link PropsselectedClass} 指定的样式。
     */
    select(...d: Array<Date>): void;

    /**
     * 取消选中项
     */
    unselect(...d: Array<Date | undefined>): void;

    /**
     * 为指定范围的日期添加 {@link Props#coveredClass} 指定的样式
     * @param range - 要覆盖的日期范围，大小无所谓，会自动排序；
     */
    cover(range: [Date, Date]): void;

    /**
     * 取消 {@link Ref#cover} 操作
     */
    uncover(): void;

    /**
     * 跳转到指定的日期
     */
    jump(date: Date): void;

    /**
     * 是否能跳转到指定的日期，只有 {@link Props#min} 或 {@link Props#max} 有值时才有效。
     */
    canJump(date: Date): boolean;

    /**
     * 移动指定数量的年月，如果是负数，表示向前移动。
     */
    offset(year?: number, month?: number): void;

    /**
     * 能否移动到指定的日期，只有 {@link Props#min} 或 {@link Props#max} 有值时才有效。
     * @param year - 移动的年数，负数表示向前移动；
     * @param month - 移动的月数，负数表示向前移动；
     */
    canOffset(year?: number, month?: number): boolean;
}

export interface Props extends BaseProps {
    /**
     * 禁用
     *
     * @reactive
     */
    disabled?: boolean;

    /**
     * 只读
     *
     * @reactive
     */
    readonly?: boolean;

    /**
     * 允许的最小日期
     *
     * @reactive
     */
    min?: Date;

    /**
     * 允许的最大日期
     *
     * @reactive
     */
    max?: Date;

    /**
     * 是否高亮周末的列
     *
     * @reactive
     */
    weekend?: boolean;

    /**
     * 一周的开始，默认为 0，即周日。
     *
     * @reactive
     */
    weekBase?: Week;

    /**
     * 是否显示周数
     *
     * @remarks
     * NOTE: 周数是依据 ISO 8601 拿所在行的中间列计算所得。
     * 如果 {@link Props#weekBase} 不为 1，那么周数指向的可能并不是当前行。
     *
     * @reactive
     */
    weeks?: boolean;

    /**
     * 点击周数时的回调函数，仅在 {@link Props#weeks} 为 true 时有效。
     * @param week - 周数；
     * @param range - 周数范围；
     */
    onWeekClick?: { (week: WeekValueType, range: [Date, Date]): void; };

    /**
     * 非响应式属性
     */
    ref: { (r: Ref): void; };

    /**
     * 星期名称的格式
     *
     * @remarks
     * 中文模式下，格式如下：
     *  - narrow 一
     *  - long 星期一
     * 不同语言可能会稍有不同
     *
     * @reactive
     */
    weekName: 'narrow' | 'long';

    /**
     * 面板初始时显示的月份
     */
    initValue: Date;

    /**
     * 点击日期时的回调函数
     * @param e - 日期；
     * @param disabled - 是否禁用；
     */
    onClick?: (e: Date, disabled?: boolean) => void;

    /**
     * 鼠标悬停在单元格上时的回调函数
     * @param e - 日期；
     * @param disabled - 单元格是否处于禁用状态；
     */
    onEnter?: (e: Date, disabled?: boolean) => void;

    /**
     * 鼠标从单元格离开时的回调函数
     * @param e - 日期；
     * @param disabled - 单元格是否处于禁用状态；
     */
    onLeave?: (e: Date, disabled?: boolean) => void;

    /**
     * 翻页时的回调函数
     * @param val - 新页面的日期；
     * @param old - 旧页面的日期；
     */
    onPaging?: (val: Date, old?: Date) => void;

    /**
     * 插件列表
     */
    plugins?: Array<DatetimePlugin>;

    // 以下样式都将作用在 td 之上，用于表示单元格在不同状态下的样式。

    /**
     * 选中项的样式
     *
     * @reactive
     */
    selectedClass: string;

    /**
     * 覆盖项的样式
     *
     * @reactive
     */
    coveredClass: string;

    /**
     * 当日项的样式
     *
     * @reactive
     */
    todayClass: string;

    /**
     * 禁用项的样式
     *
     * @reactive
     */
    disabledClass: string;
}
