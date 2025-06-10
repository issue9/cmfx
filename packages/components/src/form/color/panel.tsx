// SPDX-FileCopyrightText: 2025 caixw
//
// SPDX-License-Identifier: MIT

import { createEffect, JSX } from 'solid-js';

import { Accessor, FieldAccessor, FieldBaseProps } from '@/form/field';
import { Range } from '@/form/range';

export interface Props extends Omit<FieldBaseProps, 'layout'> {
    accessor: Accessor<string>;

    popover?: boolean | 'manual' | 'auto';

    ref?: { (el: HTMLElement): void; };
}

/**
 * oklch 颜色调整面板
 */
export default function OKLCHPanel(props: Props): JSX.Element {
    const l = FieldAccessor<number>('l', 0);
    const c = FieldAccessor<number>('c', 0);
    const h = FieldAccessor<number>('h', 0);

    const access = props.accessor;

    createEffect(() => {
        const v = access.getValue().trim();
        const vals = v.substring(6, v.length - 1).split(/\s/i);

        l.setValue(parseFloat(vals[0].substring(0, vals[0].length - 1)));
        c.setValue(parseFloat(vals[1]));
        h.setValue(parseFloat(vals[2]));
    });

    createEffect(() => {
        access.setValue(`oklch(${l.getValue()}% ${c.getValue()} ${h.getValue()})`);
    });

    return <fieldset popover={props.popover} disabled={props.disabled} class="c--oklch-panel"
        ref={el => { if (props.ref) { props.ref(el); } }}>
        <Range label='L:' fitHeight accessor={l} min={0} max={100} step={0.1} />
        <Range label='C:' fitHeight accessor={c} min={0} max={0.37} step={0.001} />
        <Range label='H:' fitHeight accessor={h} min={0} max={360} step={0.001} />
        <div class="color-block" style={{ 'background': access.getValue() }}>{access.getValue()}</div>
    </fieldset>;
}
