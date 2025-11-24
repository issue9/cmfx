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

export class HSLPicker implements Picker {
    readonly #hsl: ObjectAccessor<HSL>;

    constructor() {
        this.#hsl = new ObjectAccessor<HSL>({ h: 180, s: 50, l: 50, a: 1 });
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
            <Range fitHeight accessor={this.#hsl.accessor('h')} label={l.t('_c.color.hue')}
                ref={el => hRef = el} value={v => `${v.toFixed(2)}`} min={0} max={360} step={1} />
            <Range fitHeight accessor={this.#hsl.accessor('s')} label={l.t('_c.color.saturation')}
                ref={el => sRef = el} value={v => `${v.toFixed(2)}%`} min={0} max={100} step={.01} />
            <Range fitHeight accessor={this.#hsl.accessor('l')} label={l.t('_c.color.lightness')}
                ref={el => lRef = el} value={v => `${v.toFixed(2)}%`} min={0} max={100} step={.01} />
            <Range fitHeight accessor={this.#hsl.accessor('a')} label={l.t('_c.color.alpha')}
                ref={el => aRef = el} value={v => `${v.toFixed(2)}`} min={0} max={1} step={.01} />
        </div>;
    }
}

function fmtHSL(h: number, s: number, l: number, a: number): string {
    return new Color('hsl', [h, s, l], a).toString();
}
