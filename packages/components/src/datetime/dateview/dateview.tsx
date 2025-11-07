// SPDX-FileCopyrightText: 2024-2025 caixw
//
// SPDX-License-Identifier: MIT

import { getISOWeek, getISOWeekRange } from '@cmfx/core';
import { createMemo, createSignal, For, JSX, mergeProps, Show, untrack } from 'solid-js';

import { classList, joinClass } from '@/base';
import { useLocale } from '@/context';
import { compareDate, equalDate, sunday, weekDay, weekDays, weeks } from '@/datetime/utils';
import { buildHeader } from './header';
import styles from './style.module.css';
import { Props, Ref } from './types';

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
 * <fieldset>
 * <header>
 *     <p>2025年7月</p>
 *     <fieldset>actions</fieldset>
 * </header>
 * <table>
 *     <thead>
 *         <tr>
 *             <th></th><!--*7-->
 *         </tr>
 *     </thead>
 *     <tbody>
 *         <tr><!--*7-->
 *             <th></th><!--周-->
 *             <td></td><!--*7-->
 *         </tr>
 *     </tbody>
 * </table>
 * </fieldset>
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

    const jump = (date: Date) => {
        const old = untrack(value);
        setValue(date);
        if (props.onPaging) { props.onPaging(date, old); }
    };

    const canJump = (date: Date) => { return inRange(date > value(), date, props.min, props.max); };

    const ref: Ref = {
        select(...d: Array<Date>) {
            setSelected(prev => [...prev, ...d]);
            setToday(new Date()); // 保持 today 的正确性
        },

        unselect(...d: Array<Date | undefined>) {
            setSelected(prev => prev.filter(v => v && !d.includes(v)));
        },

        cover(range: [start: Date, end: Date]) {
            range.sort((a, b) => a.getTime() - b.getTime());
            setCovered(range);
        },

        uncover() { setCovered(); },

        jump(date: Date): void { jump(date); },

        canJump(date: Date): boolean { return canJump(date); },

        offset(year?: number, month?: number): void {
            const v = new Date(value());
            if (month !== undefined) { v.setMonth(v.getMonth() + month); }; // month 可以是负数，必须要与 undefined 比较。
            if (year !== undefined) { v.setFullYear(v.getFullYear() + year); };
            jump(v);
        },

        canOffset(year?: number, month?: number): boolean {
            const v = new Date(value());
            if (month !== undefined) { v.setMonth(v.getMonth() + month); };
            if (year !== undefined) { v.setFullYear(v.getFullYear() + year); };
            return canJump(v);
        }
    };

    props.ref(ref);

    const table = <table>
        <Show when={props.weekend}>
            <colgroup>
                <Show when={props.weeks}><col /></Show>
                <For each={weeks}>
                    {w => (
                        <col classList={{
                            [styles.weekend]: weekDay(w, props.weekBase) === 0 || weekDay(w, props.weekBase) === 6
                        }} />
                    )}
                </For>
            </colgroup>
        </Show>

        <thead>
            <tr>
                <Show when={props.weeks}><th>{l.t('_c.date.week')}</th></Show>
                <For each={weeks}>
                    {w => (
                        <th>{
                            weekFormat().format(sunday().setDate(sunday().getDate() + weekDay(w, props.weekBase)))
                        }</th>
                    )}
                </For>
            </tr>
        </thead>

        <tbody>
            <For each={weekDays(value(), props.weekBase!, props.min, props.max)}>
                {week => {
                    const isoWeek = getISOWeek(week[3][1]);
                    const weekRange = getISOWeekRange(week[3][1]);
                    return <tr>
                        <Show when={props.weeks}>
                            <th onMouseEnter={() => { setCovered(weekRange); }} onMouseLeave={() => { setCovered(); }}
                                onClick={() => {
                                    if (props.onWeekClick) {
                                        props.onWeekClick(isoWeek, weekRange);
                                    }
                                }}
                            >{isoWeek[1]}</th>
                        </Show>
                        <For each={week}>
                            {day => (
                                <td class={classList(undefined, {
                                    [props.selectedClass]: isSelected(day[1], selected()),
                                    [props.todayClass]: equalDate(today(), day[1]),
                                    [props.disabledClass]: !day[0],
                                    [props.coveredClass]: covered() && (covered()!.length === 2)
                                        && covered()![0] && compareDate(covered()![0]!, day[1]) <= 0
                                        && covered()![1] && compareDate(covered()![1]!, day[1]) >= 0
                                })} ref={el => { // 非响应
                                    if (!props.plugins || props.plugins.length === 0) { return; }
                                    props.plugins.forEach(p => p(day[1], el));
                                }} onClick={() => {
                                    if (props.onClick) { props.onClick(day[1], !day[0]); }
                                }} onMouseEnter={() => {
                                    if (props.onEnter) { props.onEnter(day[1], !day[0]); }
                                }} onMouseLeave={() => {
                                    if (props.onLeave) { props.onLeave(day[1], !day[0]); }
                                }}
                                >
                                    <time datetime={day[1].toISOString().split('T')[0]}>{day[1].getDate()}</time>
                                </td>
                            )}
                        </For>
                    </tr>;
                }}
            </For>
        </tbody>
    </table>;

    return <fieldset disabled={props.disabled}
        class={joinClass(props.palette, styles.dateview, props.class)} style={props.style}
    >
        {buildHeader(l, value, ref, props)}
        {table}
    </fieldset>;
}
