// SPDX-FileCopyrightText: 2025 caixw
//
// SPDX-License-Identifier: MIT

import { write2Clipboard } from '@cmfx/core';
import Color from 'colorjs.io';
import { createEffect, JSX, Show } from 'solid-js';

import { joinClass } from '@/base';
import { useLocale } from '@/context';
import { Accessor, FieldAccessor, FieldBaseProps } from '@/form/field';
import { Range } from '@/form/range';
import { Tooltip, TooltipRef } from '@/tooltip';
import styles from './style.module.css';

export interface Props extends Omit<FieldBaseProps, 'layout'> {
    accessor: Accessor<string>;

    /**
     * 指定一个用于计算 WCAG 值的颜色
     */
    wcag?: string;

    /**
     * WCAG 的对比度算法，默认是 WCAG 2.1，除非指定了此值为 true。
     */
    apca?: boolean;

    popover?: boolean | 'manual' | 'auto';

    ref?: { (el: HTMLElement): void; };
}

/**
 * oklch 颜色调整面板
 */
export default function OKLCHPanel(props: Props): JSX.Element {
    const loc = useLocale();

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

    let tooltip: TooltipRef;
    let colorBlock: HTMLDivElement;
    const copy = async () => {
        await write2Clipboard(access.getValue(), ()=>{
            tooltip.show(colorBlock, 'right');
        });
    };

    return <fieldset popover={props.popover} disabled={props.disabled} class={joinClass(styles['oklch-panel'], props.palette ? `palette--${props.palette}` : undefined)}
        ref={el => { if (props.ref) { props.ref(el); } }}>
        <Range label='L:' fitHeight accessor={l} min={0} max={100} step={0.1} />
        <Range label='C:' fitHeight accessor={c} min={0} max={0.37} step={0.001} />
        <Range label='H:' fitHeight accessor={h} min={0} max={360} step={0.001} />
        <div ref={el => colorBlock = el} onClick={copy} class={styles['color-block']}
            style={{ 'background': access.getValue(), 'color': props.wcag }}
        >{access.getValue()}</div>
        <Tooltip ref={el => tooltip = el}>{ loc.t('_c.copied') }</Tooltip>
        <Show when={props.wcag}>
            {(wcag)=>(
                <div class={styles.wcag}>WCAG: <span>{calcWCAG(access.getValue(), wcag(), props.apca).toFixed(2)}</span></div>
            )}
        </Show>
    </fieldset>;
}

function calcWCAG(c1: string, c2: string, apca?: boolean): number {
    const cc1 = new Color(c1);
    const cc2 = new Color(c2);
    return Math.abs(apca ? cc1.contrastAPCA(cc2) : cc1.contrastWCAG21(cc2));
}
