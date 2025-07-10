// SPDX-FileCopyrightText: 2025 caixw
//
// SPDX-License-Identifier: MIT

import { For, JSX, createMemo, createSignal, mergeProps } from 'solid-js';
import IconChevronLeft from '~icons/material-symbols/chevron-left';
import IconChevronRight from '~icons/material-symbols/chevron-right';
import IconArrowLeft from '~icons/material-symbols/keyboard-double-arrow-left';
import IconArrowRight from '~icons/material-symbols/keyboard-double-arrow-right';

import { BaseProps, classList, joinClass } from '@/base';
import { Button, ButtonGroup } from '@/button';
import { useLocale } from '@/context';
import { Week, equalDate, sunday, weekDay, weekDays, weeks } from '@/datetime/utils';
import { Plugin } from './plugin';
import styles from './style.module.css';

/**
 * 日历 {@link Calendar} 的属性值
 */
export interface Props extends BaseProps {
    /**
     * 允许的最小日期
     */
    min?: Date;

    /**
     * 允许的最大日期
     */
    max?: Date;

    /**
     * 一周的开始，默认为 0，即周日。
     */
    weekBase?: Week;

    /**
     * 当前显示的月份
     */
    current?: Date;

    /**
     * 选中项
     */
    selected?: Date;

    /**
     * 用户改变选中项时触发的事件
     */
    onSelected?: { (val: Date, old?: Date): void; };

    /**
     * 插件列表
     */
    plugins?: Array<Plugin>;

    class?: string;
    style?: JSX.HTMLAttributes<HTMLElement>['style'];
}

const presetProps: Props = {
    weekBase: 0,
} as const;

/**
 * 日历组件
 */
export default function Calendar(props: Props): JSX.Element {
    props = mergeProps(presetProps, props);

    const l = useLocale();
    const [curr, setCurr] = createSignal(props.current ?? new Date());

    const weekFormat = createMemo(() => { return l.dateTimeFormat({ weekday: 'long' }); });

    const titleFormat = createMemo(() => {
        return l.dateTimeFormat({ year: 'numeric', month: '2-digit' }).format(curr());
    });

    const now = new Date();

    const [selected, setSelected] = createSignal(props.selected);

    return <div style={props.style} class={joinClass(styles.calendar, props.class, props.palette ? `palette--${props.palette}` : undefined)}>
        <header>
            <p class={styles.title}>{titleFormat()}</p>
            <div>
                <ButtonGroup kind='fill'>
                    <Button title={l.t('_c.date.prevYear')} square onClick={() => setCurr(new Date(curr().getFullYear() - 1, curr().getMonth(), 1))}><IconArrowLeft /></Button>
                    <Button title={l.t('_c.date.prevMonth')} square onClick={() => setCurr(new Date(curr().getFullYear(), curr().getMonth() - 1, 1))}><IconChevronLeft /></Button>
                    <Button onClick={() => setCurr(new Date())}>{l.t('_c.date.today')}</Button>
                    <Button title={l.t('_c.date.nextMonth')} square onClick={() => setCurr(new Date(curr().getFullYear(), curr().getMonth() + 1, 1))}><IconChevronRight /></Button>
                    <Button title={l.t('_c.date.nextYear')} square onClick={() => setCurr(new Date(curr().getFullYear() + 1, curr().getMonth(), 1))}><IconArrowRight /></Button>
                </ButtonGroup>
            </div>
        </header>

        <div class={styles.table}>
            <table>
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
                    <For each={weekDays(curr(), props.weekBase!, props.min, props.max)}>
                        {week => (
                            <tr>
                                <For each={week}>
                                    {day => {
                                        return <td onclick={() => {
                                            if (!day[0]) { return; }

                                            if (props.onSelected) { props.onSelected(day[1], selected()); }
                                            setSelected(day[1]);
                                        }} class={classList({
                                            [styles.disabled]: !day[0],
                                            [styles.current]: selected() && equalDate(selected()!, day[1])
                                        })}>
                                            <span class={classList({
                                                [styles.today]: equalDate(now, day[1])
                                            }, styles.day)}>{day[1].getDate()}</span>
                                            <For each={props.plugins}>
                                                {(plugin) => { return plugin(day[1]); }}
                                            </For>
                                        </td>;
                                    }}
                                </For>
                            </tr>
                        )}
                    </For>
                </tbody>
            </table>
        </div>
    </div>;
}
