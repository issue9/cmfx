// SPDX-FileCopyrightText: 2024 caixw
//
// SPDX-License-Identifier: MIT

import { For, mergeProps, Show } from 'solid-js';

import { useApp } from '@/app';
import { Accessor, Choice, FieldAccessor } from '@/components/form';
import {
    hoursOptions, minutesOptions, Month, monthDays, monthsLocales,
    range, Week, weekDay, weeks, weeksLocales
} from './utils';

export interface Props {
    /**
     * 是否符带时间选择器
     */
    time?: boolean;

    // TODO min, max

    disabled?: boolean;

    readonly?: boolean;

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
                <span class="item">{p.dt.getFullYear()}</span>
                /
                <span class="item">{ctx.t(monthsLocales.get(p.dt.getMonth() as Month) as any)}</span>
            </div>

            <div class="weeks">
                <For each={weeks}>
                    {(w) => (
                        <span>{ctx.t(weeksLocales.get(weekDay(w, props.weekBase)) as any)}</span>
                    )}
                </For>
            </div>

            <div class="days">
                <For each={monthDays(p.dt, props.weekBase as Week)}>
                    {(month) => (
                        <For each={range(month[2], month[3])}>
                            {(day) => (
                                <button classList={{'selected': day === p.dt.getDate() && month[1] === p.dt.getMonth(),'disabled':!month[0]}}
                                    disabled={!month[0] || props.disabled}
                                    onClick={() => {
                                        if (props.readonly || props.disabled) { return; }

                                        const dt = new Date(ac.getValue());
                                        dt.setDate(day);
                                        setValue(dt);
                                    }}>{day}</button>
                            )}
                        </For>
                    )}
                </For>
            </div>

            <div class="actions">
                <Show when={props.time}>
                    <Choice disabled={props.disabled} readonly={props.readonly} options={hoursOptions} accessor={p.ha} />
                    <span class="mx-1">:</span>
                    <Choice disabled={props.disabled} readonly={props.readonly} options={minutesOptions} accessor={p.ma} />
                </Show>
                <button class='button flated tail' onClick={()=>setValue(new Date())}>{ctx.t(props.time ? '_internal.date.now' : '_internal.date.today')}</button>
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

    return <div classList={{
        'c--date-panel': true,
        'c--date-panel-disabled': props.disabled
    }}>
        <Panel dt={new Date(ac.getValue())} ha={ha} ma={ma} />
    </div>;
}
