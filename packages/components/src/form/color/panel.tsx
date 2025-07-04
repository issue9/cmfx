// SPDX-FileCopyrightText: 2025 caixw
//
// SPDX-License-Identifier: MIT

import { write2Clipboard } from '@cmfx/core';
import Color from 'colorjs.io';
import { createEffect, createMemo, For, JSX, Show } from 'solid-js';
import IconAccessibility from '~icons/material-symbols/accessibility';

import { classList, joinClass } from '@/base';
import { useLocale } from '@/context';
import { Accessor, fieldAccessor, FieldBaseProps } from '@/form/field';
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

    /**
     * 预设的一些颜色值，需要使用 oklch 格式的颜色值，比如：
     *  - oklch(1 0 0) // 白色
     *  - oklch(0 0 0) // 黑色
     */
    presets?: Array<string>;
}

/**
 * oklch 颜色调整面板
 *
 * 仅支持直接使用数值表示的颜色值，比如：
 *  - oklch(100% 0.1 0)
 *  - oklch(1 0 0)
 *  - oklch(1 100% 0)
 * 如果包含了计算或是变量，无法正确解析，比如以下格式不支持：
 *  - oklch(100% calc(100% - 50%) 0)
 *  - oklch(100% var(--color) 0)
 */
export default function OKLCHPanel(props: Props): JSX.Element {
    const loc = useLocale();

    const access = props.accessor;

    const l = fieldAccessor<number>('l', 0);
    const c = fieldAccessor<number>('c', 0);
    const h = fieldAccessor<number>('h', 0);
    const a = fieldAccessor<number>('a', 1);

    createEffect(() => {
        const color = new Color(access.getValue() ? access.getValue() : 'oklch(100% 0 0)');
        l.setValue(color.coords[0]);
        c.setValue(color.coords[1]);
        h.setValue(color.coords[2]);
        a.setValue(color.alpha);
    });

    createEffect(() => {
        access.setValue(new Color('oklch', [l.getValue(), c.getValue(), h.getValue()], a.getValue()).toString());
    });

    let tooltip: TooltipRef;
    let colorBlock: HTMLDivElement;
    const copy = async () => {
        await write2Clipboard(access.getValue(), () => {
            tooltip.show(colorBlock, 'right');
        });
    };

    // 转换为 Color 再转换为字符串，防止不同格式的数据造成混乱。
    const presets = createMemo(() => {
        return props.presets?.map(v => (new Color(v)).toString());
    });

    return <fieldset popover={props.popover} disabled={props.disabled} class={joinClass(styles['oklch-panel'], props.palette ? `palette--${props.palette}` : undefined)}
        ref={el => { if (props.ref) { props.ref(el); } }}>
        <Range layout='vertical' fitHeight accessor={l} min={0} max={1} step={0.001} value={v => `${(v * 100).toFixed(2)}%`} label={loc.t('_c.color.lightness')} />
        <Range layout='vertical' fitHeight accessor={c} min={0} max={0.4} step={0.001} value={v => `${v.toFixed(3)}`} label={loc.t('_c.color.chroma')} />
        <Range layout='vertical' fitHeight accessor={h} min={0} max={360} step={0.01} value={v => `${v.toFixed(2)}°`} label={loc.t('_c.color.hue')} />
        <Range layout='vertical' fitHeight accessor={a} min={0} max={1} step={0.01} value={v => v.toFixed(2)} label={loc.t('_c.color.alpha')} />

        <Show when={presets() && presets()!.length > 0}>
            <div class={styles.blocks}>
                <For each={presets()}>
                    {color =>
                        <div style={{ 'background': color.toString() }} onclick={() => access.setValue(color)}
                            class={classList({[styles.selected]: access.getValue() === color}, styles.block)}
                        />
                    }
                </For>
            </div>
        </Show>

        <div class={styles.info}>
            <div class={styles.current} ref={el => colorBlock = el} onClick={copy}
                style={{ 'background': access.getValue(), 'color': props.wcag }}
            >{access.getValue()}</div>
            <Tooltip ref={el => tooltip = el}>{loc.t('_c.copied')}</Tooltip>

            <Show when={props.wcag}>
                {wcag => (
                    <div title='WCAG' class={styles.wcag}><IconAccessibility />:
                        <span>{calcWCAG(access.getValue(), wcag(), props.apca).toFixed(2)}</span>
                    </div>
                )}
            </Show>
        </div>
    </fieldset>;
}

function calcWCAG(c1: string, c2: string, apca?: boolean): number {
    const cc1 = new Color(c1);
    const cc2 = new Color(c2);
    return Math.abs(apca ? cc1.contrastAPCA(cc2) : cc1.contrastWCAG21(cc2));
}
