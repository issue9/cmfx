// SPDX-FileCopyrightText: 2024-2025 caixw
//
// SPDX-License-Identifier: MIT

import { Accessor, createMemo, createSignal, For, JSX, mergeProps, Show } from 'solid-js';

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
    unselect(...d: Array<Date>): void;

    /**
     * 为指定范围的日期添加 {@link Props#selectedClass} 指定的样式
     *
     * @param start 开始日期
     * @param end 结束日期
     */
    cover(start?: Date, end?: Date): void;

    /**
     * 取消 {@link Ref#cover} 操作
     */
    uncover(): void;
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
     * 面板上的初始值
     */
    value: Accessor<Date>;

    /**
     * 点击日期时的回调函数
     * @param e 日期；
     * @param disabled 是否禁用，只有当前月份是非禁用的；
     */
    onClick?: (e: Date, disabled?: boolean) => void;

    /**
     * 插件列表
     */
    plugins?: Array<DatetimePlugin>;

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

    const [today, setToday] = createSignal(new Date());

    const weekFormat = createMemo(() => { return l.datetimeFormat({ weekday: props.weekName }); });
    const [selected, setSelected] = createSignal<Array<Date>>([]);
    const [covered, setCovered] = createSignal<[start?: Date, end?: Date]>([]);

    props.ref({
        select(...d: Array<Date>) {
            setSelected(prev=>[...prev, ...d]);
            setToday(new Date()); // 保持 today 的正确性
        },

        unselect(...d: Array<Date>) {
            setSelected(prev=>prev.filter(v=>!d.includes(v)));
        },

        cover(start?: Date, end?: Date) {
            const d = props.value();
            setCovered([
                start ?? new Date(d.getFullYear(), d.getMonth(), 1),
                end ?? new Date(d.getFullYear(), d.getMonth()+1, 0)
            ]);
        },

        uncover() {
            setCovered([]);
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
            <For each={weekDays(props.value(), props.weekBase!, props.min, props.max)}>
                {week => (
                    <tr>
                        <For each={week}>
                            {day => (
                                <td classList={{
                                    [props.selectedClass]: isSelected(day[1], selected()),
                                    [props.todayClass]: equalDate(today(), day[1]),
                                    [props.disabledClass]: !day[0],
                                    [props.coveredClass]: covered().length > 0
                                        && covered()[0]! >= day[1]
                                        && covered()[1]! <= day[1],
                                }} ref={el => {
                                    if (!props.plugins || props.plugins.length === 0) { return; }
                                    props.plugins.forEach(p => p(day[1], el));
                                }} onClick={() => {
                                    if (props.onClick) { props.onClick(day[1], !day[0]); }
                                }}>
                                    <span>{day[1].getDate()}</span>
                                </td>
                            )}
                        </For>
                    </tr>
                )}
            </For>
        </tbody>
    </table>;
}
