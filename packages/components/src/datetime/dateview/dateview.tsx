// SPDX-FileCopyrightText: 2024-2025 caixw
//
// SPDX-License-Identifier: MIT

import { createMemo, createSignal, For, JSX, mergeProps, Show, untrack } from 'solid-js';

import { joinClass } from '@/base';
import { useLocale } from '@/context';
import { DatetimePlugin } from '@/datetime/plugin';
import { equalDate, sunday, Week, weekDay, weekDays, weeks } from '@/datetime/utils';
import styles from './style.module.css';

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
     * @param range 要覆盖的日期范围，大小无所谓，会自动排序；
     */
    cover(range: [Date, Date]): void;

    /**
     * 取消 {@link Ref#cover} 操作
     */
    uncover(): void;

    /**
     * 提供用于显示当前面板年月的组件
     */
    Title(): JSX.Element;

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
     * @param year 移动的年数，负数表示向前移动；
     * @param month 移动的月数，负数表示向前移动；
     */
    canOffset(year?: number, month?: number): boolean;
}

export interface Props {
    /**
     * 允许的最小日期
     */
    min?: Date;

    /**
     * 允许的最大日期
     */
    max?: Date;

    /**
     * 是否高亮周末的列
     */
    weekend?: boolean;

    /**
     * 一周的开始，默认为 0，即周日。
     */
    weekBase?: Week;

    class?: string;

    /**
     * 非响应式属性
     */
    ref: { (r: Ref): void; };

    /**
     * 星期名称的格式
     *  - narrow 一
     *  - long 星期一
     * 不同语言可能会稍有不同
     */
    weekName: 'narrow' | 'long';

    /**
     * 面板初始时显示的月份
     *
     * NOTE: 非响应式属性
     */
    initValue: Date;

    /**
     * 点击日期时的回调函数
     * @param e 日期；
     * @param disabled 是否禁用；
     */
    onClick?: (e: Date, disabled?: boolean) => void;

    /**
     * 鼠标悬停时的回调函数
     * @param e 日期；
     * @param disabled 是否禁用；
     */
    onHover?: (e: Date, disabled?: boolean) => void;

    /**
     * 翻页时的回调函数
     * @param val 新页面的日期；
     * @param old 旧页面的日期；
     */
    onPaging?: (val: Date, old?: Date) => void;

    /**
     * 插件列表
     *
     * NOTE: 这是一个非响应式的属性。
     */
    plugins?: Array<DatetimePlugin>;

    // 以下样式都将作用在 td 之上，用于表示单元格在不同状态下的样式。

    selectedClass: string;
    coveredClass: string;
    todayClass: string;
    disabledClass: string;
}

const presetProps: Partial<Props> = {
    weekBase: 0,
} as const;

function isSelected(d: Date, selected: Array<Date>) {
    return selected.some(v => equalDate(v, d));
}

/**
 * 当 min 或 max 不为空时，判断 val 是否在 min 和 max 之间
 */
export function inRange(positive: boolean, val: Date, min?: Date, max?: Date): boolean {
    max = max ? new Date(max) : undefined;
    if (max !== undefined) { max.setMonth(max.getMonth() + 1); }

    min = min ? new Date(min) : undefined;
    if (min !== undefined) { min.setMonth(min.getMonth() - 1); }

    if (positive) {
        return (max ? max >= val : true) && true;
    }

    return (min ? min <= val : true) && true;
}

/**
 * 以月份展示的日期选择面板
 *
 * 返回的是一个 table 组件，其中 thead 中包含了星期名称，而 tbody 中包含了日期，大致结构如下：
 * ```html
 * <table>
 *     <thead>
 *         <tr>
 *             <th></th><!--*7-->
 *         </tr>
 *     </thead>
 *     <tbody>
 *         <tr><!--*7-->
 *             <td></td><!--*7-->
 *         </tr>
 *     </tbody>
 * </table>
 * ```
 */
export default function DateView(props: Props): JSX.Element {
    props = mergeProps(presetProps, props);
    const l = useLocale();

    const [value, setValue] = createSignal(props.initValue);
    const [today, setToday] = createSignal(new Date());

    const weekFormat = createMemo(() => {
        return new Intl.DateTimeFormat(l.locale, { weekday: props.weekName });
    });
    const [selected, setSelected] = createSignal<Array<Date>>([]);
    const [covered, setCovered] = createSignal<[start: Date, end: Date] | undefined>();

    const titleFormater = createMemo(() => {
        return new Intl.DateTimeFormat(l.locale, { year: 'numeric', month: '2-digit' });
    });

    const jump = (date: Date) => {
        const old = untrack(value);
        setValue(date);
        if (props.onPaging) { props.onPaging(date, old); }
    };

    const canJump = (date: Date) => { return inRange(date > value(), date, props.min, props.max); };

    props.ref({
        select(...d: Array<Date>) {
            setSelected(prev => [...prev, ...d]);
            setToday(new Date()); // 保持 today 的正确性
        },

        unselect(...d: Array<Date | undefined>) {
            setSelected(prev => prev.filter(v => !d.includes(v)));
        },

        cover(range: [start: Date, end: Date]) {
            range.sort((a, b) => a.getTime() - b.getTime());
            setCovered(range);
        },

        uncover() { setCovered(); },

        Title(): JSX.Element { return titleFormater().format(value()); },

        jump(date) { jump(date); },

        canJump(date) { return canJump(date); },

        offset(year, month) {
            const v = new Date(value());
            if (month !== undefined) { v.setMonth(v.getMonth() + month); }; // month 可以是负数，必须要与 undefined 比较。
            if (year !== undefined) { v.setFullYear(v.getFullYear() + year); };
            jump(v);
        },

        canOffset(year, month) {
            const v = new Date(value());
            if (month !== undefined) { v.setMonth(v.getMonth() + month); };
            if (year !== undefined) { v.setFullYear(v.getFullYear() + year); };
            return canJump(v);
        }
    });

    return <table class={joinClass(styles.panel, props.class)}>
        <Show when={props.weekend}>
            <colgroup>
                <For each={weeks}>
                    {w => (
                        <col classList={{ [styles.weekend]: weekDay(w, props.weekBase) === 0 || weekDay(w, props.weekBase) === 6 }} />
                    )}
                </For>
            </colgroup>
        </Show>

        <thead>
            <tr>
                <For each={weeks}>
                    {w => (
                        <th>{weekFormat().format((new Date(sunday)).setDate(sunday.getDate() + weekDay(w, props.weekBase)))}</th>
                    )}
                </For>
            </tr>
        </thead>

        <tbody>
            <For each={weekDays(value(), props.weekBase!, props.min, props.max)}>
                {week => (
                    <tr>
                        <For each={week}>
                            {day => (
                                <td classList={{
                                    [props.selectedClass]: isSelected(day[1], selected()),
                                    [props.todayClass]: equalDate(today(), day[1]),
                                    [props.disabledClass]: !day[0],
                                    [props.coveredClass]: covered() && covered()!.length > 0
                                        && covered()![0]! <= day[1]
                                        && covered()![1]! >= day[1],
                                }} ref={el => { // 非响应
                                    if (!props.plugins || props.plugins.length === 0) { return; }
                                    props.plugins.forEach(p => p(day[1], el));
                                }} onClick={() => {
                                    if (props.onClick) { props.onClick(day[1], !day[0]); }
                                }} onMouseEnter={() => {
                                    if (props.onHover) { props.onHover(day[1], !day[0]); }
                                }}
                                >
                                    <time datetime={day[1].toISOString().split('T')[0]}>{day[1].getDate()}</time>
                                </td>
                            )}
                        </For>
                    </tr>
                )}
            </For>
        </tbody>
    </table>;
}
