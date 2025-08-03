// SPDX-FileCopyrightText: 2025 caixw
//
// SPDX-License-Identifier: MIT

import { JSX, createEffect, createSignal, splitProps, untrack } from 'solid-js';

import { DateViewRef, WeekValueType } from '@/datetime/dateview';
import { ChangeFunc } from '@/form/field';
import { getISOWeek, getISOWeekRange, getISOWeekRangeByWeek } from '@cmfx/core';
import { CommonPanel, Props as CommonProps } from './common';

export type Props = Omit<CommonProps, 'viewRef' | 'onEnter' | 'onLeave' | 'weeks' | 'onWeekClick' | 'value' | 'onChange'> & {
    /**
     * 关联的值
     */
    value?: WeekValueType;

    /**
     * 值发生改变时触发的事件
     *
     * val 表示修改的新值；
     * old 表示修改之前的值；
     */
    onChange?: ChangeFunc<WeekValueType>;
};

/**
 * 周选择的面板
 */
export function WeekPanel(props: Props): JSX.Element {
    const [, panelProps] = splitProps(props, ['value', 'onChange']);
    const [value, setValue] = createSignal(props.value);
    let oldRange: Array<Date> = [];

    const change = (week: WeekValueType, range: [Date, Date]) => {
        const old = untrack(value);
        setValue(week);
        if (props.onChange) { props.onChange(week, old); }

        oldRange.forEach(item => ref.unselect(item));
        oldRange = [];

        for (let i = 0; i < 7; i++) {
            const day = new Date(range[0]);
            day.setDate(day.getDate() + i);

            ref.select(day);
            oldRange.push(day);
        }
    };

    createEffect(() => {
        if (!props.value) {
            oldRange.forEach(item => ref.unselect(item));
            oldRange = [];
            return;
        }

        const range = getISOWeekRangeByWeek(props.value[0], props.value[1]);
        change(props.value, range);
        ref.jump(range[0]);
    });

    let ref: DateViewRef;
    return <CommonPanel viewRef={el => ref = el} {...panelProps} weeks
        onLeave={() => { ref.uncover(); }}
        onEnter={d => { ref.cover(getISOWeekRange(d)); }}
        onChange={day => {
            if (!day) { return; }

            ref.unselect(day);
            change(getISOWeek(day), getISOWeekRange(day));
        }}
        onWeekClick={change} />;
}
