// SPDX-FileCopyrightText: 2024-2025 caixw
//
// SPDX-License-Identifier: MIT

import { createEffect, createMemo, createSignal, For, JSX, mergeProps, Show } from 'solid-js';

import { Button } from '@/components/button';
import { useApp } from '@/components/context';
import { Choice } from '@/components/form/choice';
import { Accessor, FieldAccessor, FieldBaseProps } from '@/components/form/field';
import { hoursOptions, minutesOptions, Week, weekDay, weekDays, weeks } from './utils';

export interface Props extends FieldBaseProps {
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
    accessor: Accessor<string|number>;

    popover?: boolean | 'manual' | 'auto';

    /**
     * 点击确认时的动作
     */
    ok?: { (): void; };

    ref?: { (el: HTMLElement): void; };
}

export const presetProps: Partial<Props> = {
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
    // 
    // 只有在用户点击确认的时候，才会将面板上的值赋给 props.accessor。
    const [panelValue, setPanelValue] = createSignal<Date>(new Date(props.accessor.getValue()));

    const ha = FieldAccessor('hour', new Date(panelValue().toISOString()).getHours(), false);
    ha.onChange((v) => {
        const dt = new Date(panelValue());
        dt.setHours(v);
        setPanelValue(dt);
    });

    const ma = FieldAccessor('minute', new Date(panelValue()).getMinutes(), false );
    ma.onChange((v) => {
        const dt = new Date(panelValue());
        dt.setMinutes(v);
        setPanelValue(dt);
    });

    const setValue = (dt: Date) => {
        setPanelValue(dt);
        if (props.time) {
            ha.setValue(dt.getHours());
            ma.setValue(dt.getMinutes());
        }
    };

    createEffect(() => {
        setValue(new Date(props.accessor.getValue()));
    });

    const titleFormat = createMemo(() => {
        return ctx.locale().dateTimeFormat({ year: 'numeric', month: '2-digit' }).format(panelValue());
    });

    const weekFormat = createMemo(() => {
        return ctx.locale().dateTimeFormat({ weekday: 'narrow' });
    });

    return <fieldset popover={props.popover} ref={el => { if (props.ref) { props.ref(el); } }} disabled={props.disabled} class={props.class} classList={{
        ...props.classList,
        'c--date-panel': true,
        [`palette--${props.palette}`]: !!props.palette
    }}>

        <div class="title">
            <div>
                <Button icon rounded kind='flat' title={ctx.locale().t('_i.date.prevYear')} aria-label={ctx.locale().t('_i.date.prevYear')}
                    onClick={() => {
                        if (props.readonly || props.disabled) { return; }

                        const dt = new Date(panelValue());
                        dt.setFullYear(dt.getFullYear() - 1);
                        setValue(dt);
                    }}>keyboard_double_arrow_left</Button>
                <Button icon rounded kind='flat' title={ctx.locale().t('_i.date.prevMonth')} aria-label={ctx.locale().t('_i.date.prevMonth')}
                    onClick={() => {
                        if (props.readonly || props.disabled) { return; }

                        const dt = new Date(panelValue());
                        dt.setMonth(dt.getMonth() - 1);
                        setValue(dt);
                    }}>chevron_left</Button>
            </div>

            <div>{titleFormat()}</div>

            <div>
                <Button icon rounded kind="flat" title={ctx.locale().t('_i.date.nextMonth')} aria-label={ctx.locale().t('_i.date.nextMonth')}
                    onClick={() => {
                        if (props.readonly || props.disabled) { return; }

                        const dt = new Date(panelValue());
                        dt.setMonth(dt.getMonth() + 1);
                        setValue(dt);
                    }}>chevron_right</Button>
                <Button icon rounded kind="flat" title={ctx.locale().t('_i.date.nextYear')} aria-label={ctx.locale().t('_i.date.nextYear')}
                    onClick={() => {
                        if (props.readonly || props.disabled) { return; }

                        const dt = new Date(panelValue());
                        dt.setFullYear(dt.getFullYear() + 1);
                        setValue(dt);
                    }}>keyboard_double_arrow_right</Button>
            </div>
        </div>

        <table>
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
        </table>

        <div class="actions">
            <div class="left">
                <Show when={props.time}>
                    <Choice disabled={props.disabled} readonly={props.readonly} options={hoursOptions} accessor={ha} />
                    <span class="mx-1">:</span>
                    <Choice disabled={props.disabled} readonly={props.readonly} options={minutesOptions} accessor={ma} />
                </Show>
            </div>
            <div class='right'>
                <button class="now" onClick={() => setValue(new Date())}>{ctx.locale().t(props.time ? '_i.date.now' : '_i.date.today')}</button>
                <button class="now" onClick={() => {
                    props.accessor.setValue(panelValue().toISOString());
                    if (props.ok) { props.ok(); }
                }}>{ctx.locale().t(props.time ? '_i.ok' : '_i.ok')}</button>
            </div>
        </div>
    </fieldset>;
}
