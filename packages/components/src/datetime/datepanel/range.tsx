// SPDX-FileCopyrightText: 2025 caixw
//
// SPDX-License-Identifier: MIT


import { splitProps } from 'solid-js';

import { joinClass } from '@/base';
import { DatePanel, Props as DatePanelProps } from './date';
import styles from './style.module.css';

type ValueType = [start?: Date, end?: Date];

export interface Props extends Omit<DatePanelProps, 'value' | 'onChange'> {
    value?: ValueType;

    onChange?: (value?: ValueType, old?: ValueType) => void;
}

export function DateRangePanel(props: Props) {
    const [_, panelProps] = splitProps(props, ['value', 'onChange', 'popover', 'ref', 'class', 'min', 'max']);

    return <fieldset class={joinClass(styles.range, props.palette ? `palette--${props.palette}` : undefined, props.class)}
        disabled={props.disabled} popover={props.popover} ref={el => { if (props.ref) { props.ref(el); } }}
    >
        <div class={styles.panels}>
            <DatePanel {...panelProps} value={props.value} min={props.min} max={props.end} class={styles.panel} />
            <DatePanel {...panelProps} value={props.value} max={props.max} min={props.start} class={styles.panel} />
        </div>

        <div class={styles.actions}>
            <button onClick={() => start.setValue(new Date().getTime() - 7 * 86400000)}>前一周</button>
            <button onClick={() => start.setValue(new Date().getTime() - 30 * 86400000)}>前一月</button>
            <button onClick={() => start.setValue(new Date().getTime() - 365 * 86400000)}>一年前</button>
        </div>
    </fieldset>;
}
