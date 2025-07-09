// SPDX-FileCopyrightText: 2025 caixw
//
// SPDX-License-Identifier: MIT

import { mergeProps, splitProps } from 'solid-js';

import { joinClass } from '@/base';
import { fieldAccessor } from '@/form/field';
import styles from './style.module.css';

export interface Props  {
    popover?: boolean | 'manual' | 'auto';

    ref?: { (el: HTMLElement): void; };
}

export default function RangePanel(props: Props) {
    return <div>range panel</div>;
    props = mergeProps(presetProps, props);
    const accessor = props.accessor;
    const [_, panelProps] = splitProps(props, ['accessor', 'ref', 'palette']);

    const start = fieldAccessor('start', accessor.getValue()[0]);
    const end = fieldAccessor('end', accessor.getValue()[1]);

    return <div class={joinClass(styles['range-panel'], props.palette ? `palette--${props.palette}` : undefined)}>
        <div class={styles['range-panels']}>
            <Panel {...panelProps} accessor={start} />
            <Panel {...panelProps} accessor={end} />
        </div>

        <div class={styles['range-actions']}>
            <button onClick={() => start.setValue(new Date().getTime() - 86400000)}>昨天</button>
            <button onClick={() => start.setValue(new Date().getTime() - 2 * 86400000)}>前天</button>
            <button onClick={() => start.setValue(new Date().getTime() - 7 * 86400000)}>前一周</button>
            <button onClick={() => start.setValue(new Date().getTime() - 30 * 86400000)}>前一月</button>
            <button onClick={() => start.setValue(new Date().getTime() - 365 * 86400000)}>一年前</button>
        </div>
    </div>;
}
