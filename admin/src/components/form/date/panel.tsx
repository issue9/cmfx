// SPDX-FileCopyrightText: 2024-2025 caixw
//
// SPDX-License-Identifier: MIT

import { createEffect, createMemo, createSignal, For, JSX, mergeProps, onMount, Show, untrack } from 'solid-js';

import { Palette } from '@/components/base';
import { Button } from '@/components/button';
import { useApp } from '@/components/context';
import { Accessor, FieldBaseProps } from '@/components/form/field';
import { hoursOptions, minutesOptions, Week, weekDay, weekDays, weeks } from './utils';

export interface Props extends FieldBaseProps {
    /**
     * 一些突出操作的样式色盘
     */
    accentPalette?: Palette;

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

    /**
     * 如果是字符串，表示一个能被 {@link Date.parse} 识别的日期格式，
     * 如果是 number，则表示微秒。
     */
    accessor: Accessor<string | number | undefined>;

    popover?: boolean | 'manual' | 'auto';

    /**
     * 对应确定操作按钮
     */
    ok?: { (): void; };

    /**
     * 对应清除操作按钮
     */
    clear?: { (): void; };

    /**
     * 对应今日操作按钮
     */
    now?: { (): void; };

    ref?: { (el: HTMLElement): void; };
}

export const presetProps: Partial<Props> = {
    accentPalette: 'primary',
    weekBase: 0,
};

const weekBase = new Date('2024-10-20'); // 这是星期天，作为计算星期的基准日期。

/**
 * 日期选择的面板
 */
export function DatePanel(props: Props): JSX.Element {
    props = mergeProps(presetProps, props);
    const ctx = useApp();

    // 当前面板上的值
    const val = props.accessor.getValue();
    const [panelValue, setPanelValue] = createSignal<Date>(val !== undefined ? new Date(val) : new Date());

    const scrollTimer = () => {
        if (props.time) {
            const items = timeRef.querySelectorAll('.item>li.selected');
            if (items) {
                for (const item of items) {
                    item.scrollIntoView({ block: 'start', behavior: 'smooth' });
                }
            }
        }
    };

    const setValue = (dt: Date) => {
        setPanelValue(dt);
        scrollTimer();
    };

    createEffect(() => {
        const v = props.accessor.getValue();
        if (v !== undefined) { setValue(new Date(v)); }
    });

    const titleFormat = createMemo(() => {
        return ctx.locale().dateTimeFormat({ year: 'numeric', month: '2-digit' }).format(panelValue());
    });

    const weekFormat = createMemo(() => { return ctx.locale().dateTimeFormat({ weekday: 'narrow' }); });

    // 以下用于处理 timeRef 根据 dateRef 的高度作适配调整。
    let dateRef: HTMLDivElement;
    let timeRef: HTMLDivElement;

    onMount(() => {
        const rect = dateRef.getBoundingClientRect();
        timeRef.style.height = rect.height + 'px';
        scrollTimer();
    });

    const title = <div class="title">
        <div>
            <Button icon rounded kind='flat' class="!p-1" title={ctx.locale().t('_i.date.prevYear')} aria-label={ctx.locale().t('_i.date.prevYear')}
                onClick={() => {
                    if (props.readonly || props.disabled) { return; }

                    const dt = new Date(panelValue());
                    dt.setFullYear(dt.getFullYear() - 1);
                    setValue(dt);
                }}>keyboard_double_arrow_left</Button>
            <Button icon rounded kind='flat' class="!p-1" title={ctx.locale().t('_i.date.prevMonth')} aria-label={ctx.locale().t('_i.date.prevMonth')}
                onClick={() => {
                    if (props.readonly || props.disabled) { return; }

                    const dt = new Date(panelValue());
                    dt.setMonth(dt.getMonth() - 1);
                    setValue(dt);
                }}>chevron_left</Button>
        </div>

        <div>{titleFormat()}</div>

        <div>
            <Button icon rounded kind="flat" class="!p-1" title={ctx.locale().t('_i.date.nextMonth')} aria-label={ctx.locale().t('_i.date.nextMonth')}
                onClick={() => {
                    if (props.readonly || props.disabled) { return; }

                    const dt = new Date(panelValue());
                    dt.setMonth(dt.getMonth() + 1);
                    setValue(dt);
                }}>chevron_right</Button>
            <Button icon rounded kind="flat" class="!p-1" title={ctx.locale().t('_i.date.nextYear')} aria-label={ctx.locale().t('_i.date.nextYear')}
                onClick={() => {
                    if (props.readonly || props.disabled) { return; }

                    const dt = new Date(panelValue());
                    dt.setFullYear(dt.getFullYear() + 1);
                    setValue(dt);
                }}>keyboard_double_arrow_right</Button>
        </div>
    </div>;

    const timer = <div ref={el => timeRef = el} classList={{
        'time': true,
        '!flex': props.time,
        '!hidden': !props.time,
    }}>
        <ul class="item">
            <For each={hoursOptions}>
                {(item) => (
                    <li classList={{ 'selected': panelValue().getHours() == item[0] }}
                        onClick={() => {
                            if (props.disabled || props.readonly) { return; }
                            const dt = new Date(panelValue());
                            dt.setHours(item[0]);
                            setValue(dt);
                        }}
                    >{item[1]}</li>
                )}
            </For>
        </ul>

        <ul class="item">
            <For each={minutesOptions}>
                {(item) => (
                    <li classList={{ 'selected': panelValue().getMinutes() == item[0] }}
                        onClick={() => {
                            if (props.disabled || props.readonly) { return; }
                            const dt = new Date(panelValue());
                            dt.setMinutes(item[0]);
                            setValue(dt);
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
                    {(w) => (
                        <col classList={{ 'weekend': weekDay(w, props.weekBase) === 0 || weekDay(w, props.weekBase) === 6 }} />
                    )}
                </For>
            </colgroup>
        </Show>

        <thead>
            <tr>
                <For each={weeks}>
                    {(w) => (
                        <th>{weekFormat().format((new Date(weekBase)).setDate(weekBase.getDate() + weekDay(w, props.weekBase)))}</th>
                    )}
                </For>
            </tr>
        </thead>

        <tbody>
            <For each={weekDays(panelValue(), props.weekBase!, props.min, props.max)}>
                {(week) => (
                    <tr>
                        <For each={week}>
                            {(day) => (
                                <td>
                                    <button classList={{ 'selected': day[2] === panelValue().getDate() && day[1] === panelValue().getMonth() }}
                                        disabled={!day[0] || props.disabled}
                                        onClick={() => {
                                            if (props.readonly || props.disabled) { return; }
    
                                            const dt = new Date(panelValue());
                                            dt.setDate(day[2]);
                                            setValue(dt);
                                        }}>{day[2]}</button>
                                </td>
                            )}
                        </For>
                    </tr>
                )}
            </For>
        </tbody>
    </table>;

    return <fieldset popover={props.popover} ref={el => { if (props.ref) { props.ref(el); } }} disabled={props.disabled} class={props.class} classList={{
        ...props.classList,
        'c--date-panel': true,
        [`palette--${props.palette}`]: !!props.palette
    }}>
        <div class="main">
            <div ref={el => dateRef = el}>{title}{daysSelector}</div>
            {timer}
        </div>

        <div class="actions">
            <div class="left">
                <button class="action" onClick={() => {
                    setValue(new Date());
                    if (props.now) { props.now(); }
                }}>{ctx.locale().t(props.time ? '_i.date.now' : '_i.date.today')}</button>
            </div>

            <div class="right">
                <button class="action" onClick={() => {
                    // 清除只对 accessor 的内容任务清除，panelValue 不变。
                    props.accessor.setValue(undefined);
                    if (props.clear) { props.clear(); }
                }}>{ctx.locale().t('_i.date.clear')}</button>

                <button classList={{ 'action': true, [`palette--${props.accentPalette}`]: !!props.accentPalette }} onClick={() => {
                    props.accessor.setValue(untrack(panelValue).toISOString());
                    if (props.ok) { props.ok(); }
                }}>{ctx.locale().t(props.time ? '_i.ok' : '_i.ok')}</button>
            </div>
        </div>
    </fieldset>;
}
