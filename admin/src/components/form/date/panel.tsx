// SPDX-FileCopyrightText: 2024 caixw
//
// SPDX-License-Identifier: MIT

import { For, mergeProps, Show } from 'solid-js';

import { useApp } from '@/app/context';
import { FieldBaseProps } from '@/components/form';
import { Accessor, FieldAccessor } from '@/components/form/access';
import { Choice } from '@/components/form/choice';
import {
    hoursOptions, minutesOptions, Month, monthDays, monthsLocales,
    Week, weekDay, weekDays, weeks, weeksLocales
} from './utils';

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
}

const defaultProps: Partial<Props> = {
    weekBase: 0,
};

/**
 * 日期选择的面板
 */
export default function (props: Props) {
    props = mergeProps(defaultProps, props);
    const ctx = useApp();
    const ac = props.accessor;

    const typ = typeof ac.getValue();
    const setValue = typ === 'string' ? (dt: Date) => {
        ac.setValue(dt.toISOString());
    } : (dt: Date) => {
        ac.setValue(dt.getTime());
    };

    const Panel = (p: { dt: Date, ha: Accessor<number>, ma: Accessor<number> }) => {
        return <>

            <div class="title">
                <div>
                    <button onClick={()=>{
                        if (props.readonly || props.disabled) { return; }

                        const dt = new Date(ac.getValue());
                        dt.setFullYear(p.dt.getFullYear()-1);
                        setValue(dt);
                    }} title={ctx.t('_internal.date.prevYear')} aria-label={ctx.t('_internal.date.prevYear')} class="c--icon">keyboard_double_arrow_left</button>
                    <button onClick={()=>{
                        if (props.readonly || props.disabled) { return; }

                        const dt = new Date(ac.getValue());
                        dt.setMonth(p.dt.getMonth()-1);
                        setValue(dt);
                    }} title={ctx.t('_internal.date.prevMonth')} aria-label={ctx.t('_internal.date.prevMonth')} class="c--icon">chevron_left</button>
                </div>

                <div>
                    <span>{p.dt.getFullYear()}</span>
                    /
                    <span>{ctx.t(monthsLocales.get(p.dt.getMonth() as Month) as any)}</span>
                </div>

                <div>
                    <button onClick={()=>{
                        if (props.readonly || props.disabled) { return; }

                        const dt = new Date(ac.getValue());
                        dt.setMonth(p.dt.getMonth()+1);
                        setValue(dt);
                    }} title={ctx.t('_internal.date.nextMonth')} aria-label={ctx.t('_internal.date.nextMonth')} class="c--icon">chevron_right</button>
                    <button onClick={()=>{
                        if (props.readonly || props.disabled) { return; }

                        const dt = new Date(ac.getValue());
                        dt.setFullYear(p.dt.getFullYear()+1);
                        setValue(dt);

                    }} title={ctx.t('_internal.date.nextYear')} aria-label={ctx.t('_internal.date.nextYear')} class="c--icon">keyboard_double_arrow_right</button>
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
                                <th>{ctx.t(weeksLocales.get(weekDay(w, props.weekBase)) as any)}</th>
                            )}
                        </For>
                    </tr>
                </thead>

                <tbody>
                    <For each={weekDays(monthDays(p.dt, props.weekBase as Week))}>
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
                <button class="now" onClick={()=>setValue(new Date())}>{ctx.t(props.time ? '_internal.date.now' : '_internal.date.today')}</button>
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

    return <fieldset disabled={props.disabled} classList={{
        'c--date-panel': true,
        [`palette--${props.palette}`]: !!props.palette
    }}>
        <Panel dt={new Date(ac.getValue())} ha={ha} ma={ma} />
    </fieldset>;
}
