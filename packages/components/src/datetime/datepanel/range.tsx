// SPDX-FileCopyrightText: 2025 caixw
//
// SPDX-License-Identifier: MIT


import { createSignal, Show, splitProps } from 'solid-js';

import { joinClass } from '@/base';
import { useLocale } from '@/context';
import { DateViewRef } from '@/datetime/dateview';
import { CommonPanel, Props as CommonProps } from './common';
import styles from './style.module.css';

type ValueType = [start?: Date, end?: Date];

export interface Props extends Omit<CommonProps, 'value' | 'onChange' | 'viewRef'> {
    value?: ValueType;

    onChange?: (value?: ValueType, old?: ValueType) => void;

    /**
     * 是否显示快捷选择栏
     */
    shortcuts?: boolean;
}

export function DateRangePanel(props: Props) {
    const [_, panelProps] = splitProps(props, ['value', 'onChange', 'popover', 'ref', 'class', 'min', 'max']);

    const l = useLocale();
    let viewRef: DateViewRef;

    const [values, setValues] = createSignal<ValueType>(props.value ?? [undefined, undefined]);
    let index = 0; // 当前设置的值属于 values 的哪个索引值

    const change = (value?: Date) => {
        switch (index) {
        case 0:
            setValues([value, undefined]);
            break;
        case 1:
            setValues([values()[0], value]);
            break;
        }
        index = index === 0 ? 1 : 0;

        if (props.onChange) { props.onChange(values(), props.value); }
    };

    return <fieldset class={joinClass(styles.range, props.palette ? `palette--${props.palette}` : undefined, props.class)}
        disabled={props.disabled} popover={props.popover} ref={el => { if (props.ref) { props.ref(el); } }}
    >
        <main>
            <div class={styles.panels}>
                <CommonPanel {...panelProps} value={values()[0]} min={props.min} max={values()[1]} class={styles.panel}
                    onChange={(e, disabled) => {
                        if (disabled) { return; }
                        change(e);
                    }}
                />
                <CommonPanel {...panelProps} value={values()[1]} max={props.max} min={values()[0]} class={styles.panel}
                    onChange={(e, disabled) => {
                        if (disabled) { return; }
                        change(e);
                    }}
                />
            </div>

            <Show when={props.shortcuts}>
                <div class={styles.shortcuts}>
                    <button onClick={() => setValues(setDay(-7))}>{l.t('_c.date.lastMonth')}</button>

                    <button onClick={() => setValues(setDay(-7))}>{l.t('_c.date.lastQuarter')}</button>
                    <button onClick={() => setValues(setDay(-7))}>{l.t('_c.date.thisQuarter')}</button>
                    <button onClick={() => setValues(setDay(30))}>{l.t('_c.date.nextQuarter')}</button>

                    <button onClick={() => setValues(setDay(-7))}>{l.t('_c.date.lastYear')}</button>
                    <button onClick={() => setValues(setDay(-7))}>{l.t('_c.date.thisYear')}</button>
                    <button onClick={() => setValues(setDay(30))}>{l.t('_c.date.nextYear')}</button>
                </div>
            </Show>
        </main>

        <div class={styles.value}>
            <Show when={values()[0]}>{start => { return l.datetime.format(start()); }}</Show>
            -
            <Show when={values()[1]}>{end => { return l.datetime.format(end()); }}</Show>
        </div>
    </fieldset>;
}

function setDay(delta: number): ValueType {
    const start = new Date();
    const end = new Date(start);
    end.setDate(end.getDate() + delta);

    return [start, end];
}
