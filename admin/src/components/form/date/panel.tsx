// SPDX-FileCopyrightText: 2024 caixw
//
// SPDX-License-Identifier: MIT

import { createMemo, For, mergeProps, Show } from 'solid-js';

import { useApp } from '@/components/context';
import { Button } from '@/components/button';
import { FieldBaseProps } from '@/components/form';
import { Accessor, FieldAccessor } from '@/components/form/access';
import { Choice } from '@/components/form/choice';
import { JSX } from 'solid-js';
import { hoursOptions, minutesOptions, Week, weekDay, weekDays, weeks } from './utils';

export interface Props extends FieldBaseProps {
    /**
     * 是否符带时间选择器
     */
    time?: boolean;

    // TODO min, max

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
    const ac = props.accessor;

    const typ = typeof ac.getValue();
    const setValue = typ === 'string' ? (dt: Date) => {
        ac.setValue(dt.toISOString());
    } : (dt: Date) => {
        ac.setValue(dt.getTime());
    };

    const titleFormat = createMemo(() => {
        return ctx.locale().dateTimeFormat({ year: 'numeric', month: '2-digit' });
    });

    const weekFormat = createMemo(() => {
        return ctx.locale().dateTimeFormat({ weekday: 'narrow' });
    });

    const Panel = (p: { dt: Date, ha: Accessor<number>, ma: Accessor<number> }) => {
        return <>

            <div class="title">
                <div>
                    <Button icon rounded kind='flat' title={ctx.locale().t('_i.date.prevYear')} aria-label={ctx.locale().t('_i.date.prevYear')}
                        onClick={()=>{
                            if (props.readonly || props.disabled) { return; }

                            const dt = new Date(ac.getValue());
                            dt.setFullYear(p.dt.getFullYear()-1);
                            setValue(dt);
                        }}>keyboard_double_arrow_left</Button>
                    <Button icon rounded kind='flat' title={ctx.locale().t('_i.date.prevMonth')} aria-label={ctx.locale().t('_i.date.prevMonth')}
                        onClick={()=>{
                            if (props.readonly || props.disabled) { return; }

                            const dt = new Date(ac.getValue());
                            dt.setMonth(p.dt.getMonth()-1);
                            setValue(dt);
                        }}>chevron_left</Button>
                </div>

                <div>{titleFormat().format(p.dt)}</div>

                <div>
                    <Button icon rounded kind="flat" title={ctx.locale().t('_i.date.nextMonth')} aria-label={ctx.locale().t('_i.date.nextMonth')}
                        onClick={()=>{
                            if (props.readonly || props.disabled) { return; }

                            const dt = new Date(ac.getValue());
                            dt.setMonth(p.dt.getMonth()+1);
                            setValue(dt);
                        }}>chevron_right</Button>
                    <Button icon rounded kind="flat" title={ctx.locale().t('_i.date.nextYear')} aria-label={ctx.locale().t('_i.date.nextYear')}
                        onClick={()=>{
                            if (props.readonly || props.disabled) { return; }

                            const dt = new Date(ac.getValue());
                            dt.setFullYear(p.dt.getFullYear()+1);
                            setValue(dt);
                        }}>keyboard_double_arrow_right</Button>
                </div>
            </div>

            <table>
                <Show when={props.weekend}>
                    <colgroup>
                        <For each={weeks}>
                            {(w) => (
                                <col classList={{'weekend': weekDay(w, props.weekBase) === 0 || weekDay(w, props.weekBase)===6}} />
                            )}
                        </For>
                    </colgroup>
                </Show>

                <thead>
                    <tr>
                        <For each={weeks}>
                            {(w) => (
                                <th>{weekFormat().format((new Date(weekBase)).setDate(weekBase.getDate()+weekDay(w, props.weekBase)))}</th>
                            )}
                        </For>
                    </tr>
                </thead>

                <tbody>
                    <For each={weekDays(p.dt, props.weekBase!)}>
                        {(week) => (
                            <tr>
                                <For each={week}>
                                    {(day) => (
                                        <td>
                                            <button classList={{'selected': day[2] === p.dt.getDate() && day[1] === p.dt.getMonth()}}
                                                disabled={!day[0] || props.disabled}
                                                onClick={() => {
                                                    if (props.readonly || props.disabled) { return; }

                                                    const dt = new Date(ac.getValue());
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
                <div class="time">
                    <Show when={props.time}>
                        <Choice disabled={props.disabled} readonly={props.readonly} options={hoursOptions} accessor={p.ha} />
                        <span class="mx-1">:</span>
                        <Choice disabled={props.disabled} readonly={props.readonly} options={minutesOptions} accessor={p.ma} />
                    </Show>
                </div>
                <button class="now" onClick={()=>setValue(new Date())}>{ctx.locale().t(props.time ? '_i.date.now' : '_i.date.today')}</button>
            </div>
        </>;
    };

    const ha = FieldAccessor('hour', new Date(ac.getValue()).getHours(), false);
    ha.onChange((v) => {
        const dt = new Date(ac.getValue());
        dt.setHours(v);
        setValue(dt);
    });

    const ma = FieldAccessor('minute', new Date(ac.getValue()).getMinutes(), false );
    ma.onChange((v) => {
        const dt = new Date(ac.getValue());
        dt.setMinutes(v);
        setValue(dt);
    });

    ac.onChange(() => {
        const dt = new Date(ac.getValue());
        ha.setValue(dt.getHours());
        ma.setValue(dt.getMinutes());
    });

    return <fieldset popover={props.popover} ref={el => { if (props.ref) { props.ref(el); }} } disabled={props.disabled} class={props.class} classList={{
        ...props.classList,
        'c--date-panel': true,
        [`palette--${props.palette}`]: !!props.palette
    }}><Panel dt={new Date(ac.getValue())} ha={ha} ma={ma} /></fieldset>;
}
