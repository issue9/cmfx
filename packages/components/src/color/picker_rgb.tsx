// SPDX-FileCopyrightText: 2025 caixw
//
// SPDX-License-Identifier: MIT

import { createEffect, JSX, Signal } from 'solid-js';
import Color from 'colorjs.io';

import { ObjectAccessor, Range, RangeRef } from '@/form';
import { Picker } from './picker';
import styles from './style.module.css';
import { useLocale } from '@/context';

type RGB = {
    r: number;
    g: number;
    b: number;
    a: number;
};

export class RGBPicker implements Picker {
    readonly #rgb: ObjectAccessor<RGB>;

    constructor() {
        this.#rgb = new ObjectAccessor<RGB>({ r: 1, g: 1, b: 1, a: 1 });
    }

    get id(): string { return 'rgb'; }
    get localeID(): string { return '_c.color.rgb'; }
    include(value: string): boolean { return value.startsWith('rgb('); }

    panel(signal: Signal<string>): JSX.Element {
        let rRef: RangeRef;
        let gRef: RangeRef;
        let bRef: RangeRef;
        let aRef: RangeRef;

        createEffect(() => {
            const raw = this.#rgb.raw();
            const rr = raw.r;
            const gg = raw.g;
            const bb = raw.b;
            const aa = raw.a;
            signal[1](fmtRGB(rr, gg, bb, aa));

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

        const l = useLocale();
        return <div class={styles.rgb}>
            <Range fitHeight label={l.t('_c.color.red')} accessor={this.#rgb.accessor('r')}
                ref={el => rRef = el} min={0} max={1} step={.01} />
            <Range fitHeight label={l.t('_c.color.green')} accessor={this.#rgb.accessor('g')}
                ref={el => gRef = el} min={0} max={1} step={.01} />
            <Range fitHeight label={l.t('_c.color.blue')} accessor={this.#rgb.accessor('b')}
                ref={el => bRef = el} min={0} max={1} step={.01} />
            <Range fitHeight label={l.t('_c.color.alpha')} accessor={this.#rgb.accessor('a')}
                ref={el => aRef = el} min={0} max={1} step={.01} />
        </div>;
    }
}

function fmtRGB(r: number, g: number, b: number, a: number): string {
    return new Color('srgb', [r, g, b], a).toString();
}
