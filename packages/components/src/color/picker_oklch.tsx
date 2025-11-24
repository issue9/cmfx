// SPDX-FileCopyrightText: 2025 caixw
//
// SPDX-License-Identifier: MIT

import { createEffect, JSX, Signal } from 'solid-js';
import Color from 'colorjs.io';

import { ObjectAccessor, Range, RangeRef } from '@/form';
import { Picker } from './picker';
import styles from './style.module.css';
import { useLocale } from '@/context';

type OKLCH = {
    l: number;
    c: number;
    h: number;
    a: number;
};

export class OKLCHPicker implements Picker {
    readonly #oklch: ObjectAccessor<OKLCH>;

    constructor() {
        this.#oklch = new ObjectAccessor<OKLCH>({ l: 1, c: .4, h: 1, a: 1 });
    }

    get id(): string { return 'oklch'; }
    get localeID(): string { return '_c.color.oklch'; }
    include(value: string): boolean { return value.startsWith('oklch('); }

    panel(signal: Signal<string>): JSX.Element {
        let rl: RangeRef;
        let rc: RangeRef;
        let rh: RangeRef;
        let ra: RangeRef;

        createEffect(() => { // 根据值改变背景颜色
            const raw = this.#oklch.raw();
            const ll = raw.l;
            const cc = raw.c;
            const hh = raw.h;
            const aa = raw.a;
            signal[1](fmtOKLCH(ll, cc, hh, aa));

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

        const l = useLocale();

        return <div class={styles.oklch}>
            <Range fitHeight accessor={this.#oklch.accessor('l')} label={l.t('_c.color.lightness')} ref={el => rl = el}
                value={v => `${v.toFixed(2)}%`} min={0} max={100} step={0.01} />
            <Range fitHeight accessor={this.#oklch.accessor('c')} label={l.t('_c.color.chroma')} ref={el => rc = el}
                value={v => `${v.toFixed(2)}`} min={0} max={.4} step={0.01} />
            <Range fitHeight accessor={this.#oklch.accessor('h')} label={l.t('_c.color.hue')} ref={el => rh = el}
                value={v => `${v.toFixed(2)}`} min={0} max={360} step={0.01} />
            <Range fitHeight accessor={this.#oklch.accessor('a')} label={l.t('_c.color.alpha')} ref={el => ra = el}
                value={v => `${v.toFixed(2)}`} min={0} max={1} step={0.01} />
        </div>;
    }
}

function fmtOKLCH(l: number, c: number, h: number, a: number): string {
    return new Color('oklch', [l, c, h], a).toString();
}
