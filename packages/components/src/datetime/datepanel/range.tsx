// SPDX-FileCopyrightText: 2025 caixw
//
// SPDX-License-Identifier: MIT


import { splitProps } from 'solid-js';

import { joinClass } from '@/base';
import { DateChange, DatePanel, Props as DatePanelProps } from './date';
import styles from './style.module.css';

export interface Props extends Omit<DatePanelProps, 'value' | 'onChange'> {
    /**
     * 起始时间
     */
    start?: Date;

    /**
     * 结束时间
     */
    end?: Date;

    /**
     * start 修改时触发事件，触发条件可参考 {@link DatePanelProps#onChange} 字段。
     */
    onStartChange?: DateChange;

    /**
     * end 修改时触发事件，触发条件可参考 {@link DatePanelProps#onChange} 字段。
     */
    onEndChange?: DateChange;
}

export function DateRangePanel(props: Props) {
    const [_, panelProps] = splitProps(props, ['start', 'end', 'onStartChange', 'onEndChange', 'popover', 'ref', 'class', 'min', 'max']);

    return <fieldset class={joinClass(styles.range, props.palette ? `palette--${props.palette}` : undefined, props.class)}
        disabled={props.disabled} popover={props.popover} ref={el => { if (props.ref) { props.ref(el); } }}
    >
        <div class={styles.panels}>
            <DatePanel {...panelProps} value={props.start} min={props.min} max={props.end} />
            <DatePanel {...panelProps} value={props.end} max={props.max} min={props.start} />
        </div>

        <div class={styles.actions}>
            <button onClick={() => start.setValue(new Date().getTime() - 7 * 86400000)}>前一周</button>
            <button onClick={() => start.setValue(new Date().getTime() - 30 * 86400000)}>前一月</button>
            <button onClick={() => start.setValue(new Date().getTime() - 365 * 86400000)}>一年前</button>
        </div>
    </fieldset>;
}
