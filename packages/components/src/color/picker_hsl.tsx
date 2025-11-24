// SPDX-FileCopyrightText: 2025 caixw
//
// SPDX-License-Identifier: MIT

import { createEffect, JSX, Signal } from 'solid-js';
import Color from 'colorjs.io';

import { ObjectAccessor, Range, RangeRef } from '@/form';
import { Picker } from './picker';
import styles from './style.module.css';
import { useLocale } from '@/context';

type HSL = {
    h: number;
    s: number;
    l: number;
    a: number;
};

/**
 * HSL 的 {@link Picker} 实现
 */
export class HSLPicker implements Picker {
    readonly #hsl: ObjectAccessor<HSL>;
    readonly #h?: number;
    readonly #s?: number;
    readonly #l?: number;
    readonly #a?: number;

    /**
     * 构造函数
     *
     * @param h - 如果指定了非 undefined 的值，表示将 h 固定为此值，无法修改，取值范围 [0,360]；
     * @param s - 如果指定了非 undefined 的值，表示将 s 固定为此值，无法修改，取值范围 [0,100]；
     * @param l - 如果指定了非 undefined 的值，表示将 l 固定为此值，无法修改，取值范围 [0,100]；
     * @param a - 如果指定了非 undefined 的值，表示将 a 固定为此值，无法修改，取值范围 [0,1]；
     */
    constructor(h?: number, s?: number, l?: number, a?: number) {
        this.#hsl = new ObjectAccessor<HSL>({ h: h ?? 180, s: s ?? 50, l: l ?? 50, a: a ?? 1 });
        this.#h = h;
        this.#s = s;
        this.#l = l;
        this.#a = a;
    }

    get id(): string { return 'hsl'; }

    get localeID(): string { return '_c.color.hsl'; }

    include(value: string): boolean { return value.startsWith('hsl('); }

    panel(signal: Signal<string>): JSX.Element {
        let hRef: RangeRef;
        let sRef: RangeRef;
        let lRef: RangeRef;
        let aRef: RangeRef;

        createEffect(() => {
            const raw = this.#hsl.raw();
            const hh = raw.h;
            const ss = raw.s;
            const ll = raw.l;
            const aa = raw.a;
            signal[1](fmtHSL(hh, ss, ll, aa));

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

        const l = useLocale();
        return <div class={styles.hsl}>
            <Range disabled={!!this.#h} fitHeight accessor={this.#hsl.accessor('h')} label={l.t('_c.color.hue')}
                ref={el => hRef = el} value={v => `${v.toFixed(2)}`} min={0} max={360} step={1} />
            <Range disabled={!!this.#s} fitHeight accessor={this.#hsl.accessor('s')} label={l.t('_c.color.saturation')}
                ref={el => sRef = el} value={v => `${v.toFixed(2)}%`} min={0} max={100} step={.01} />
            <Range disabled={!!this.#l} fitHeight accessor={this.#hsl.accessor('l')} label={l.t('_c.color.lightness')}
                ref={el => lRef = el} value={v => `${v.toFixed(2)}%`} min={0} max={100} step={.01} />
            <Range disabled={!!this.#a} fitHeight accessor={this.#hsl.accessor('a')} label={l.t('_c.color.alpha')}
                ref={el => aRef = el} value={v => `${v.toFixed(2)}`} min={0} max={1} step={.01} />
        </div>;
    }
}

function fmtHSL(h: number, s: number, l: number, a: number): string {
    return new Color('hsl', [h, s, l], a).toString();
}
