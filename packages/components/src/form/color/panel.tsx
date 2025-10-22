// SPDX-FileCopyrightText: 2025 caixw
//
// SPDX-License-Identifier: MIT

import Color from 'colorjs.io';
import { createEffect, createMemo, createSignal, For, JSX, Show } from 'solid-js';
import IconPicker from '~icons/circum/picker-half';
import IconAccessibility from '~icons/octicon/accessibility-inset-24';

import { joinClass, RefProps } from '@/base';
import { Button } from '@/button';
import { useLocale } from '@/context';
import { Accessor, fieldAccessor, FieldBaseProps } from '@/form/field';
import { Range, RangeRef } from '@/form/range';
import { copy2Clipboard } from '@/kit';
import styles from './style.module.css';

declare global {
    interface Window {
        // TODO: https://caniuse.com/?search=EyeDropper
        EyeDropper: any;
    }
}

export interface Ref {
    element(): HTMLFieldSetElement;
}

export interface Props extends Omit<FieldBaseProps, 'layout'| 'hasHelp' | 'rounded'>, RefProps<Ref> {
    /**
     * NOTE: 非响应式属性
     */
    accessor: Accessor<string>;

    /**
     * 指定一个用于计算 WCAG 值的颜色
     *
     * 如果该值不为空，那么在颜色展示区域上的文字会以此颜色值显示，否则使用默认颜色值或是没有文字。
     *
     * NOTE: 该值应该是 oklch 格式，比如 oklch(1 0 0)，否则可能无法正确计算 WCAG 值。
     */
    wcag?: string;

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
 * @remarks 仅支持直接使用数值表示的颜色值，比如：
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

    const l = fieldAccessor<number>('l', 1);
    const c = fieldAccessor<number>('c', 0);
    const h = fieldAccessor<number>('h', 0);
    const a = fieldAccessor<number>('a', 1);

    createEffect(() => { // 监视外部变化
        const color = new Color(access.getValue() ? access.getValue() : 'oklch(100% 0 0)');
        l.setValue(color.coords[0]);
        c.setValue(color.coords[1]);
        h.setValue(color.coords[2]);
        a.setValue(color.alpha);
    });

    createEffect(() => {
        access.setValue(new Color('oklch', [l.getValue(), c.getValue(), h.getValue()], a.getValue()).toString());
    });

    // 将 presets 转换为 Color 再转换为字符串，防止不同格式的数据造成混乱。
    const presets = createMemo(() => {
        return props.presets?.map(v => (new Color(v)).toString());
    });

    let rl: RangeRef;
    let rc: RangeRef;
    let rh: RangeRef;
    let ra: RangeRef;

    createEffect(() => { // 根据值改变背景颜色
        const ll = l.getValue();
        const cc = c.getValue();
        const hh = h.getValue();
        const aa = a.getValue();

        rl.input().style.background = `linear-gradient(to right, ${fmtColor(0, cc, hh, aa)},
                    ${fmtColor(.1, cc, hh, aa)}, ${fmtColor(.2, cc, hh, aa)}, ${fmtColor(.3, cc, hh, aa)},
                    ${fmtColor(.4, cc, hh, aa)}, ${fmtColor(.5, cc, hh, aa)}, ${fmtColor(.6, cc, hh, aa)},
                    ${fmtColor(.7, cc, hh, aa)}, ${fmtColor(.8, cc, hh, aa)}, ${fmtColor(.9, cc, hh, aa)},
                    ${fmtColor(1, cc, hh, aa)})`;
        rc.input().style.background = `linear-gradient(to right, ${fmtColor(ll, 0, hh, aa)},
                    ${fmtColor(ll, 0.04, hh, aa)}, ${fmtColor(ll, 0.08, hh, aa)}, ${fmtColor(ll, 0.12, hh, aa)},
                    ${fmtColor(ll, 0.16, hh, aa)}, ${fmtColor(ll, 0.20, hh, aa)}, ${fmtColor(ll, 0.24, hh, aa)},
                    ${fmtColor(ll, 0.28, hh, aa)}, ${fmtColor(ll, 0.32, hh, aa)}, ${fmtColor(ll, 0.36, hh, aa)},
                    ${fmtColor(ll, 0.4, hh, aa)})`;
        rh.input().style.background = `linear-gradient(to right, ${fmtColor(ll, cc, 0, aa)},
                    ${fmtColor(ll, cc, 20, aa)}, ${fmtColor(ll, cc, 40, aa)}, ${fmtColor(ll, cc, 60, aa)},
                    ${fmtColor(ll, cc, 80, aa)}, ${fmtColor(ll, cc, 100, aa)}, ${fmtColor(ll, cc, 120, aa)},
                    ${fmtColor(ll, cc, 140, aa)}, ${fmtColor(ll, cc, 160, aa)}, ${fmtColor(ll, cc, 180, aa)},
                    ${fmtColor(ll, cc, 200, aa)}, ${fmtColor(ll, cc, 220, aa)}, ${fmtColor(ll, cc, 240, aa)},
                    ${fmtColor(ll, cc, 260, aa)}, ${fmtColor(ll, cc, 280, aa)}, ${fmtColor(ll, cc, 300, aa)},
                    ${fmtColor(ll, cc, 320, aa)}, ${fmtColor(ll, cc, 340, aa)}, ${fmtColor(ll, cc, 360, aa)})`;
        ra.input().style.background = `linear-gradient(to right, ${fmtColor(ll, cc, hh, 0)},
                    ${fmtColor(ll, cc, hh, .1)}, ${fmtColor(ll, cc, hh, .2)}, ${fmtColor(ll, cc, hh, .3)},
                    ${fmtColor(ll, cc, hh, .4)}, ${fmtColor(ll, cc, hh, .5)}, ${fmtColor(ll, cc, hh, .6)},
                    ${fmtColor(ll, cc, hh, .7)}, ${fmtColor(ll, cc, hh, .8)}, ${fmtColor(ll, cc, hh, .9)},
                    ${fmtColor(ll, cc, hh, 1)})`;
    });

    const [apca, setApca] = createSignal(false);
    let contentRef: HTMLDivElement;

    return <fieldset aria-readonly={props.readonly} disabled={props.disabled}
        class={joinClass(props.palette, styles['oklch-panel'], props.class)}
        ref={el => {
            if (props.ref) { props.ref({ element: () => el }); }
        }}
    >
        <Range ref={el => rl = el} layout='vertical' fitHeight accessor={l} min={0} max={1} step={0.001}
            readonly={props.readonly} value={v => `${(v * 100).toFixed(2)}%`} label={loc.t('_c.color.lightness')} />
        <Range ref={el => rc = el} layout='vertical' fitHeight accessor={c} min={0} max={0.4} step={0.001}
            readonly={props.readonly} value={v => `${v.toFixed(3)}`} label={loc.t('_c.color.chroma')} />
        <Range ref={el => rh = el} layout='vertical' fitHeight accessor={h} min={0} max={360} step={0.01}
            readonly={props.readonly} value={v => `${v.toFixed(2)}°`} label={loc.t('_c.color.hue')} />
        <Range ref={el => ra = el} layout='vertical' fitHeight accessor={a} min={0} max={1} step={0.01}
            readonly={props.readonly} value={v => v.toFixed(2)} label={loc.t('_c.color.alpha')} />

        <Show when={presets() && presets()!.length > 0}>
            <div class={styles.blocks}>
                <For each={presets()}>
                    {color =>
                        <div style={{ 'background': color.toString() }} onclick={() => {
                            if (props.readonly || props.disabled) { return; }
                            access.setValue(color);
                        }} class={joinClass(undefined, access.getValue() === color ? styles.selected : '', styles.block)}
                        />
                    }
                </For>
            </div>
        </Show>

        <div class={styles.info}>
            <Show when={'EyeDropper' in window}>
                <Button kind='border' square onclick={async () => {
                    const eye = new window.EyeDropper();
                    const c = new Color((await eye.open()).sRGBHex);
                    access.setValue(c.to('oklch').toString());
                }}><IconPicker /></Button>
            </Show>
            <div class={styles.current} ref={el => contentRef = el}
                onClick={() => copy2Clipboard(contentRef, access.getValue())}
                style={{ 'background': access.getValue(), 'color': props.wcag ?? 'var(--fg)' }}
            >{access.getValue()}</div>

            <Show when={props.wcag}>
                {wcag => (
                    <div onClick={() => setApca(!apca())} class={styles.wcag}
                        title={apca() ? 'WCAG 3.X(APCA)' : 'WCAG 2.X'}
                    >
                        <IconAccessibility />
                        <span>{calcWCAG(access.getValue(), wcag(), apca())}</span>
                    </div>
                )}
            </Show>
        </div>
    </fieldset>;
}

function calcWCAG(c1: string, c2: string, apca?: boolean): string {
    const cc1 = new Color(c1);
    const cc2 = new Color(c2);
    // apca 中正数表示深色文字在浅色背景上，负数表示浅色文字在深色背景上，所以要做绝对值。

    return apca
        ? Math.abs(cc1.contrastAPCA(cc2)).toFixed(0)
        : cc1.contrastWCAG21(cc2).toFixed(1);
}

function fmtColor(l: number, c: number, h: number, a: number): string {
    return new Color('oklch', [l, c, h], a).toString();
}
