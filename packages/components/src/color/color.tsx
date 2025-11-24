// SPDX-FileCopyrightText: 2025 caixw
//
// SPDX-License-Identifier: MIT

import { BaseProps, joinClass } from '@/base';
import { createSignal, createEffect, For, Match, JSX, onMount, Switch } from 'solid-js';
import Color from 'colorjs.io';

import { ObjectAccessor, Range, RangeRef } from '@/form';
import { useLocale } from '@/context';
import { Tab, TabItem } from '@/tab';
import { vars } from './vars';
import styles from './style.module.css';

const kinds = ['vars', 'oklch', 'hsl', 'rgb', 'preset'] as const;

export type Kind = typeof kinds[number];

export interface Props extends BaseProps {
    value: string;

    onChange?: (value: string) => void;

    /**
     * 预设的颜色值
     *
     * @remarks
     * 预设的颜色值，可以是颜色名称、十六进制颜色值、RGB颜色值等。
     */
    presets?: Array<string>;
}

type OKLCH = {
    l: number;
    c: number;
    h: number;
    a: number;
};

type HSL = {
    h: number;
    s: number;
    l: number;
    a: number;
};

type RGB = {
    r: number;
    g: number;
    b: number;
    a: number;
};

export default function ColorPanel(props: Props) {
    const l = useLocale();

    // 记录 vars 面板的长和宽，用于保持其它面板拥有相同的长宽。
    const [width, setWidth] = createSignal(0);
    const [height, setHeight] = createSignal(0);

    let varsRef: HTMLDivElement;
    onMount(() => {
        const rect = varsRef.getBoundingClientRect();
        setWidth(rect.width);
        setHeight(rect.height);
    });

    const [kind, setKind] = createSignal('vars');
    const kindTabs: Array<TabItem> = [
        {'id': 'vars', label: l.t('_c.color.vars')},
        {'id': 'oklch', label: l.t('_c.color.oklch')},
        {'id': 'hsl', label: l.t('_c.color.hsl')},
        {'id': 'rgb', label: l.t('_c.color.rgb')},
    ];

    const [value, setValue] = createSignal<string>('');

    createEffect(() => {
        const v = value();
        if (props.onChange) { props.onChange(v); }
    });

    const VarsSelector = (): JSX.Element => {
        return <div class={styles.vars} ref={el => varsRef = el}>
            <For each={vars}>
                {v =>
                    <span class={styles.color} style={{ 'background': `var(${v})` }} onclick={()=>{
                        setValue(v);
                    }} />
                }
            </For>
        </div>;
    };

    const oklch = new ObjectAccessor<OKLCH>({ l: 1, c: .4, h: 1, a: 1 });
    const OKLCHSelector = (): JSX.Element => {
        let rl: RangeRef;
        let rc: RangeRef;
        let rh: RangeRef;
        let ra: RangeRef;

        createEffect(() => { // 根据值改变背景颜色
            const raw = oklch.raw();
            const ll = raw.l;
            const cc = raw.c;
            const hh = raw.h;
            const aa = raw.a;
            setValue(fmtOKLCH(ll, cc, hh, aa));

            rl.input().style.background = `linear-gradient(to right, ${fmtOKLCH(0, cc, hh, aa)},
                ${fmtOKLCH(.1, cc, hh, aa)}, ${fmtOKLCH(.2, cc, hh, aa)}, ${fmtOKLCH(.3, cc, hh, aa)},
                ${fmtOKLCH(.4, cc, hh, aa)}, ${fmtOKLCH(.5, cc, hh, aa)}, ${fmtOKLCH(.6, cc, hh, aa)},
                ${fmtOKLCH(.7, cc, hh, aa)}, ${fmtOKLCH(.8, cc, hh, aa)}, ${fmtOKLCH(.9, cc, hh, aa)},
                ${fmtOKLCH(1, cc, hh, aa)})`;
            rc.input().style.background = `linear-gradient(to right, ${fmtOKLCH(ll, 0, hh, aa)},
                ${fmtOKLCH(ll, 0.04, hh, aa)}, ${fmtOKLCH(ll, 0.08, hh, aa)}, ${fmtOKLCH(ll, 0.12, hh, aa)},
                ${fmtOKLCH(ll, 0.16, hh, aa)}, ${fmtOKLCH(ll, 0.20, hh, aa)}, ${fmtOKLCH(ll, 0.24, hh, aa)},
                ${fmtOKLCH(ll, 0.28, hh, aa)}, ${fmtOKLCH(ll, 0.32, hh, aa)}, ${fmtOKLCH(ll, 0.36, hh, aa)},
                ${fmtOKLCH(ll, 0.4, hh, aa)})`;
            rh.input().style.background = `linear-gradient(to right, ${fmtOKLCH(ll, cc, 0, aa)},
                ${fmtOKLCH(ll, cc, 20, aa)}, ${fmtOKLCH(ll, cc, 40, aa)}, ${fmtOKLCH(ll, cc, 60, aa)},
                ${fmtOKLCH(ll, cc, 80, aa)}, ${fmtOKLCH(ll, cc, 100, aa)}, ${fmtOKLCH(ll, cc, 120, aa)},
                ${fmtOKLCH(ll, cc, 140, aa)}, ${fmtOKLCH(ll, cc, 160, aa)}, ${fmtOKLCH(ll, cc, 180, aa)},
                ${fmtOKLCH(ll, cc, 200, aa)}, ${fmtOKLCH(ll, cc, 220, aa)}, ${fmtOKLCH(ll, cc, 240, aa)},
                ${fmtOKLCH(ll, cc, 260, aa)}, ${fmtOKLCH(ll, cc, 280, aa)}, ${fmtOKLCH(ll, cc, 300, aa)},
                ${fmtOKLCH(ll, cc, 320, aa)}, ${fmtOKLCH(ll, cc, 340, aa)}, ${fmtOKLCH(ll, cc, 360, aa)})`;
            ra.input().style.background = `linear-gradient(to right, ${fmtOKLCH(ll, cc, hh, 0)},
                ${fmtOKLCH(ll, cc, hh, .1)}, ${fmtOKLCH(ll, cc, hh, .2)}, ${fmtOKLCH(ll, cc, hh, .3)},
                ${fmtOKLCH(ll, cc, hh, .4)}, ${fmtOKLCH(ll, cc, hh, .5)}, ${fmtOKLCH(ll, cc, hh, .6)},
                ${fmtOKLCH(ll, cc, hh, .7)}, ${fmtOKLCH(ll, cc, hh, .8)}, ${fmtOKLCH(ll, cc, hh, .9)},
                ${fmtOKLCH(ll, cc, hh, 1)})`;
        });

        return <div class={styles.oklch} style={{ 'width': width() + 'px', 'height': height() + 'px' }}>
            <Range fitHeight accessor={oklch.accessor('l')} label={l.t('_c.color.lightness')} ref={el => rl = el}
                value={v => `${v.toFixed(2)}%`} min={0} max={100} step={0.01} />
            <Range fitHeight accessor={oklch.accessor('c')} label={l.t('_c.color.chroma')} ref={el => rc = el}
                value={v => `${v.toFixed(2)}`} min={0} max={.4} step={0.01} />
            <Range fitHeight accessor={oklch.accessor('h')} label={l.t('_c.color.hue')} ref={el => rh = el}
                value={v => `${v.toFixed(2)}`} min={0} max={360} step={0.01} />
            <Range fitHeight accessor={oklch.accessor('a')} label={l.t('_c.color.alpha')} ref={el => ra = el}
                value={v => `${v.toFixed(2)}`} min={0} max={1} step={0.01} />
        </div>;
    };

    const hsl = new ObjectAccessor<HSL>({ h: 180, s: 50, l: 50, a: 1 });
    const HSLSelector = (): JSX.Element => {
        let hRef: RangeRef;
        let sRef: RangeRef;
        let lRef: RangeRef;
        let aRef: RangeRef;

        createEffect(() => {
            const raw = hsl.raw();
            const hh = raw.h;
            const ss = raw.s;
            const ll = raw.l;
            const aa = raw.a;
            setValue(fmtHSL(hh, ss, ll, aa));

            hRef.input().style.background = `linear-gradient(to right, ${fmtHSL(0, ss, ll, aa)},
                ${fmtHSL(20, ss, ll, aa)}, ${fmtHSL(40, ss, ll, aa)}, ${fmtHSL(60, ss, ll, aa)},
                ${fmtHSL(80, ss, ll, aa)}, ${fmtHSL(100, ss, ll, aa)}, ${fmtHSL(120, ss, ll, aa)},
                ${fmtHSL(140, ss, ll, aa)}, ${fmtHSL(160, ss, ll, aa)}, ${fmtHSL(180, ss, ll, aa)},
                ${fmtHSL(200, ss, ll, aa)}, ${fmtHSL(220, ss, ll, aa)}, ${fmtHSL(240, ss, ll, aa)},
                ${fmtHSL(260, ss, ll, aa)}, ${fmtHSL(280, ss, ll, aa)}, ${fmtHSL(300, ss, ll, aa)},
                ${fmtHSL(320, ss, ll, aa)}, ${fmtHSL(340, ss, ll, aa)}, ${fmtHSL(360, ss, ll, aa)})`;

            sRef.input().style.background = `linear-gradient(to right, ${fmtHSL(hh, 0, ll, aa)},
                ${fmtHSL(hh, 10, ll, aa)},${fmtHSL(hh, 20, ll, aa)},${fmtHSL(hh, 30, ll, aa)},${fmtHSL(hh, 40, ll, aa)},
                ${fmtHSL(hh, 50, ll, aa)},${fmtHSL(hh, 60, ll, aa)},${fmtHSL(hh, 70, ll, aa)},${fmtHSL(hh, 80, ll, aa)},
                ${fmtHSL(hh, 90, ll, aa)},${fmtHSL(hh, 100, ll, aa)})`;

            lRef.input().style.background = `linear-gradient(to right, ${fmtHSL(hh, ss, 0, aa)},
                ${fmtHSL(hh, ss, 10, aa)},${fmtHSL(hh, ss, 20, aa)},${fmtHSL(hh, ss, 30, aa)},${fmtHSL(hh, ss, 40, aa)},
                ${fmtHSL(hh, ss, 50, aa)},${fmtHSL(hh, ss, 60, aa)},${fmtHSL(hh, ss, 70, aa)},${fmtHSL(hh, ss, 80, aa)},
                ${fmtHSL(hh, ss, 90, aa)},${fmtHSL(hh, ss, 100, aa)})`;

            aRef.input().style.background = `linear-gradient(to right, ${fmtHSL(hh, ss, ll, 0)},
                ${fmtHSL(hh, ss, ll, .1)},${fmtHSL(hh, ss, ll, .2)},${fmtHSL(hh, ss, ll, .3)},${fmtHSL(hh, ss, ll, .4)},
                ${fmtHSL(hh, ss, ll, .5)},${fmtHSL(hh, ss, ll, .6)},${fmtHSL(hh, ss, ll, .7)},${fmtHSL(hh, ss, ll, .8)},
                ${fmtHSL(hh, ss, ll, .9)}, ${fmtHSL(hh, ss, ll, 1)})`;
        });

        return <div class={styles.hsl} style={{ 'width': width() + 'px', 'height': height() + 'px' }}>
            <Range fitHeight accessor={hsl.accessor('h')} label={l.t('_c.color.hue')}
                ref={el => hRef = el} value={v => `${v.toFixed(2)}`} min={0} max={360} step={1} />
            <Range fitHeight accessor={hsl.accessor('s')} label={l.t('_c.color.saturation')}
                ref={el => sRef = el} value={v => `${v.toFixed(2)}%`} min={0} max={100} step={.01} />
            <Range fitHeight accessor={hsl.accessor('l')} label={l.t('_c.color.lightness')}
                ref={el => lRef = el} value={v => `${v.toFixed(2)}%`} min={0} max={100} step={.01} />
            <Range fitHeight accessor={hsl.accessor('a')} label={l.t('_c.color.alpha')}
                ref={el => aRef = el} value={v => `${v.toFixed(2)}`} min={0} max={1} step={.01} />
        </div>;
    };

    const rgb = new ObjectAccessor<RGB>({ r: 1, g: 1, b: 1, a: 1 });
    const RGBSelector = (): JSX.Element => {
        let rRef: RangeRef;
        let gRef: RangeRef;
        let bRef: RangeRef;
        let aRef: RangeRef;

        createEffect(() => {
            const raw = rgb.raw();
            const rr = raw.r;
            const gg = raw.g;
            const bb = raw.b;
            const aa = raw.a;
            setValue(fmtRGB(rr, gg, bb, aa));

            rRef.input().style.background = `linear-gradient(to right, ${fmtRGB(0, gg, bb, aa)},
                ${fmtRGB(.1, gg, bb, aa)},${fmtRGB(.2, gg, bb, aa)},${fmtRGB(.3, gg, bb, aa)},${fmtRGB(.4, gg, bb, aa)},
                ${fmtRGB(.5, gg, bb, aa)},${fmtRGB(.6, gg, bb, aa)},${fmtRGB(.7, gg, bb, aa)},${fmtRGB(.8, gg, bb, aa)},
                ${fmtRGB(.9, gg, bb, aa)},${fmtRGB(1, gg, bb, aa)})`;

            gRef.input().style.background = `linear-gradient(to right, ${fmtRGB(rr, 0, bb, aa)},
                ${fmtRGB(rr, .1, bb, aa)},${fmtRGB(rr, .2, bb, aa)},${fmtRGB(rr, .3, bb, aa)},${fmtRGB(rr, .4, bb, aa)},
                ${fmtRGB(rr, .5, bb, aa)},${fmtRGB(rr, .6, bb, aa)},${fmtRGB(rr, .7, bb, aa)},${fmtRGB(rr, .8, bb, aa)},
                ${fmtRGB(rr, .9, bb, aa)},${fmtRGB(rr, 1, bb, aa)})`;

            bRef.input().style.background = `linear-gradient(to right, ${fmtRGB(rr, gg, 0, aa)},
                ${fmtRGB(rr, gg, .1, aa)},${fmtRGB(rr, gg, .2, aa)},${fmtRGB(rr, gg, .3, aa)},${fmtRGB(rr, gg, .4, aa)},
                ${fmtRGB(rr, gg, .5, aa)},${fmtRGB(rr, gg, .6, aa)},${fmtRGB(rr, gg, .7, aa)},${fmtRGB(rr, gg, .8, aa)},
                ${fmtRGB(rr, gg, .9, aa)},${fmtRGB(rr, gg, 1, aa)})`;

            aRef.input().style.background = `linear-gradient(to right, ${fmtRGB(rr, gg, bb, 0)},
                ${fmtRGB(rr, gg, bb, .1)},${fmtRGB(rr, gg, bb, .2)},${fmtRGB(rr, gg, bb, .3)},${fmtRGB(rr, gg, bb, .4)},
                ${fmtRGB(rr, gg, bb, .5)},${fmtRGB(rr, gg, bb, .6)},${fmtRGB(rr, gg, bb, .7)},${fmtRGB(rr, gg, bb, .8)},
                ${fmtRGB(rr, gg, bb, .9)}, ${fmtRGB(rr, gg, bb, 1)})`;
        });

        return <div class={styles.rgb} style={{ 'width': width() + 'px', 'height': height() + 'px' }}>
            <Range fitHeight label={l.t('_c.color.red')} accessor={rgb.accessor('r')}
                ref={el => rRef = el} min={0} max={1} step={.01} />
            <Range fitHeight label={l.t('_c.color.green')} accessor={rgb.accessor('g')}
                ref={el => gRef = el} min={0} max={1} step={.01} />
            <Range fitHeight label={l.t('_c.color.blue')} accessor={rgb.accessor('b')}
                ref={el => bRef = el} min={0} max={1} step={.01} />
            <Range fitHeight label={l.t('_c.color.alpha')} accessor={rgb.accessor('a')}
                ref={el => aRef = el} min={0} max={1} step={.01} />
        </div>;
    };

    return <div class={joinClass(props.palette, styles['color-panel'], props.class)} style={props.style}>
        <Tab class={styles.tabs} items={kindTabs} onChange={v => setKind(v)} />

        <main>
            <Switch>
                <Match when={kind() === 'vars'}><VarsSelector /></Match>
                <Match when={kind() === 'oklch'}><OKLCHSelector /></Match>
                <Match when={kind() === 'hsl'}><HSLSelector /></Match>
                <Match when={kind() === 'rgb'}><RGBSelector /></Match>
                <Match when={kind() === 'preset'}>
                    preset
                </Match>
            </Switch>
        </main>

        <footer>
            <p>{value()}</p>
        </footer>
    </div>;
}

function fmtOKLCH(l: number, c: number, h: number, a: number): string {
    return new Color('oklch', [l, c, h], a).toString();
}

function fmtRGB(r: number, g: number, b: number, a: number): string {
    return new Color('srgb', [r, g, b], a).toString();
}

function fmtHSL(h: number, s: number, l: number, a: number): string {
    console.log(h,s,l);
    return new Color('hsl', [h, s, l], a).toString();
}
