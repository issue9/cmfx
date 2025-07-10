// SPDX-FileCopyrightText: 2024-2025 caixw
//
// SPDX-License-Identifier: MIT

import { createEffect, createMemo, createSignal, For, JSX, mergeProps, onCleanup, onMount, Show } from 'solid-js';
import IconChevronLeft from '~icons/material-symbols/chevron-left';
import IconChevronRight from '~icons/material-symbols/chevron-right';
import IconArrowLeft from '~icons/material-symbols/keyboard-double-arrow-left';
import IconArrowRight from '~icons/material-symbols/keyboard-double-arrow-right';

import { BaseProps, classList, joinClass } from '@/base';
import { useLocale } from '@/context';
import { equalDate, hoursOptions, minutesOptions, sunday, Week, weekDay, weekDays, weeks } from '@/datetime/utils';
import styles from './style.module.css';

export interface DateChange {
    (val: Date, old?: Date): void;
}

export interface Props extends BaseProps {
    tabindex?: number;
    disabled?: boolean;
    readonly?: boolean;

    /**
     * 是否符带时间选择器
     */
    time?: boolean;

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

    popover?: boolean | 'manual' | 'auto';

    /**
     * 关联的值
     */
    value?: Date;

    /**
     * 值发生改变时触发的事件
     *
     * 此方法只在以下条件下触发：
     * - 点击天数始终触发；
     * - 在已经点击过天数的情况下，点击小时和分钟也触发；
     */
    onChange?: DateChange;

    ref?: { (el: HTMLElement): void; };

    class?: string;
}

export const presetProps: Partial<Props> = {
    weekBase: 0,
} as const;

/**
 * 日期选择的面板
 */
export function DatePanel(props: Props): JSX.Element {
    props = mergeProps(presetProps, props);
    const l = useLocale();

    const [panelValue, setPanelValue] = createSignal<Date>(props.value ?? new Date()); // 面板上当前页显示的时候
    const [value, setValue] = createSignal<Date | undefined>(props.value); // 实际的值

    createEffect(() => { setValue(props.value); });

    let dateRef: HTMLDivElement;
    let timeRef: HTMLDivElement;

    const scrollTimer = () => {
        if (!props.time) { return; }

        const items = timeRef.querySelectorAll(`.${styles.item}>li.${styles.selected}`);
        if (items && items.length > 0) {
            for (const item of items) {
                const p = item.parentElement;
                const top = item.getBoundingClientRect().top - p!.getBoundingClientRect().top;

                // scrollBy 与 scrollIntoView 不同点在于，scrollBy 并不会让整个 p 出现在页面的可见范围之内。
                p!.scrollBy({ top: top, behavior: 'smooth' });
            }
        }
    };

    const [today, setToday] = createSignal(new Date());

    const changePanelValue = (val: Date) => {
        setPanelValue(val);
        scrollTimer();
        setToday(new Date()); // 保证 today 的值始终是当前日期
    };

    // 改变值且触发 onchange 事件
    const change = (val: Date) => {
        changePanelValue(val);

        const old = value();
        setValue(val);
        if (props.onChange) { props.onChange(val, old); }
    };

    const titleFormat = createMemo(() => {
        return l.dateTimeFormat({ year: 'numeric', month: '2-digit' }).format(panelValue());
    });

    const weekFormat = createMemo(() => { return l.dateTimeFormat({ weekday: 'narrow' }); });

    onMount(() => {
        // TODO: [CSS anchor](https://caniuse.com/?search=anchor) 支持全面的话，可以用 CSS 代替。
        const resizeObserver = new ResizeObserver(entries => {
            timeRef.style.height = entries[0]!.borderBoxSize[0].blockSize.toString() + 'px';
            scrollTimer();
        });

        resizeObserver.observe(dateRef!);
        onCleanup(() => { resizeObserver.disconnect(); });
    });

    // 年月标题
    const title = <div class={styles.title}>
        <div class="flex">
            <button tabIndex={props.tabindex}
                title={l.t('_c.date.prevYear')} aria-label={l.t('_c.date.prevYear')}
                onClick={() => {
                    if (props.readonly || props.disabled) { return; }

                    const dt = new Date(panelValue());
                    dt.setFullYear(dt.getFullYear() - 1);
                    changePanelValue(dt);
                }}><IconArrowLeft /></button>
            <button tabIndex={props.tabindex}
                title={l.t('_c.date.prevMonth')} aria-label={l.t('_c.date.prevMonth')}
                onClick={() => {
                    if (props.readonly || props.disabled) { return; }

                    const dt = new Date(panelValue());
                    dt.setMonth(dt.getMonth() - 1);
                    changePanelValue(dt);
                }}><IconChevronLeft /></button>
        </div>

        <div>{titleFormat()}</div>

        <div class="flex">
            <button tabIndex={props.tabindex}
                title={l.t('_c.date.nextMonth')} aria-label={l.t('_c.date.nextMonth')}
                onClick={() => {
                    if (props.readonly || props.disabled) { return; }

                    const dt = new Date(panelValue());
                    dt.setMonth(dt.getMonth() + 1);
                    changePanelValue(dt);
                }}><IconChevronRight /></button>
            <button tabIndex={props.tabindex}
                title={l.t('_c.date.nextYear')} aria-label={l.t('_c.date.nextYear')}
                onClick={() => {
                    if (props.readonly || props.disabled) { return; }

                    const dt = new Date(panelValue());
                    dt.setFullYear(dt.getFullYear() + 1);
                    changePanelValue(dt);
                }}><IconArrowRight /></button>
        </div>
    </div>;

    // 小时分钟选择器
    const timer = <div ref={el => timeRef = el} class={classList({
        '!flex': props.time,
        '!hidden': !props.time,
    }, styles.time)}>
        <ul class={styles.item}>
            <For each={hoursOptions}>
                {(item) => (
                    <li classList={{ [styles.selected]: panelValue().getHours() == item[0] }}
                        onClick={() => {
                            if (props.disabled || props.readonly) { return; }
                            const dt = new Date(panelValue());
                            dt.setHours(item[0]);

                            if (value()) {
                                change(dt);
                            } else {
                                changePanelValue(dt);
                            }
                        }}
                    >{item[1]}</li>
                )}
            </For>
        </ul>

        <ul class={styles.item}>
            <For each={minutesOptions}>
                {(item) => (
                    <li classList={{ [styles.selected]: panelValue().getMinutes() == item[0] }}
                        onClick={() => {
                            if (props.disabled || props.readonly) { return; }
                            const dt = new Date(panelValue());
                            dt.setMinutes(item[0]);

                            if (value()) {
                                change(dt);
                            } else {
                                changePanelValue(dt);
                            }
                        }}
                    >{item[1]}</li>
                )}
            </For>
        </ul>
    </div>;

    const daysSelector = <table>
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
            <For each={weekDays(panelValue(), props.weekBase!, props.min, props.max)}>
                {week => (
                    <tr>
                        <For each={week}>
                            {day => (
                                <td>
                                    <button tabIndex={props.tabindex} classList={{
                                        [styles.selected]: value() && equalDate(value()!, day[1]),
                                        [styles.today]: equalDate(today(), day[1]),
                                    }}
                                    disabled={!day[0] || props.disabled}
                                    onClick={() => {
                                        if (props.readonly || props.disabled) { return; }
                                        change(day[1]);
                                    }}>{day[1].getDate()}</button>
                                </td>
                            )}
                        </For>
                    </tr>
                )}
            </For>
        </tbody>
    </table>;

    return <fieldset popover={props.popover} ref={el => { if (props.ref) { props.ref(el); } }} disabled={props.disabled}
        class={joinClass(styles.panel, props.class, props.palette ? `palette--${props.palette}` : undefined)}>
        <div ref={el => dateRef = el}>{title}{daysSelector}</div>
        {timer}
    </fieldset>;
}
