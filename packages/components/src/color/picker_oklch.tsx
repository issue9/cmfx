// SPDX-FileCopyrightText: 2025 caixw
//
// SPDX-License-Identifier: MIT

import { createEffect, JSX, Signal } from 'solid-js';
import Color from 'colorjs.io';

import { ObjectAccessor, Range, RangeRef } from '@/form';
import { PickerPanel } from './picker';
import styles from './style.module.css';
import { useLocale } from '@/context';

type OKLCH = {
    l: number;
    c: number;
    h: number;
    a: number;
};

/**
 * OKLCH 的 {@link PickerPanel} 实现
 */
export class OKLCHPickerPanel implements PickerPanel {
    readonly #oklch: ObjectAccessor<OKLCH>;
    readonly #l?: number;
    readonly #c?: number;
    readonly #h?: number;
    readonly #a?: number;

    /**
     * 构造函数
     *
     * @param l - 如果指定了非 undefined 的值，表示将 l 固定为此值，无法修改，取值范围 [0,1]；
     * @param c - 如果指定了非 undefined 的值，表示将 c 固定为此值，无法修改，取值范围 [0,.4]；
     * @param h - 如果指定了非 undefined 的值，表示将 h 固定为此值，无法修改，取值范围 [0,360]；
     * @param a - 如果指定了非 undefined 的值，表示将 a 固定为此值，无法修改，取值范围 [0,1]；
     */
    constructor(l?: number, c?: number, h?: number, a?: number) {
        this.#oklch = new ObjectAccessor<OKLCH>({ l: l ?? 1, c: c ?? .4, h: h ?? 1, a: a ?? 1 });
        this.#l = l;
        this.#c = c;
        this.#h = h;
        this.#a = a;
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
            const store = this.#oklch.getValue();
            const ll = store.l;
            const cc = store.c;
            const hh = store.h;
            const aa = store.a;
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
                disabled={!!this.#l} value={v => `${(v*100).toFixed(2)}%`} min={0} max={1} step={0.0001} />
            <Range fitHeight accessor={this.#oklch.accessor('c')} label={l.t('_c.color.chroma')} ref={el => rc = el}
                disabled={!!this.#c} value={v => `${v.toFixed(2)}`} min={0} max={.4} step={0.01} />
            <Range fitHeight accessor={this.#oklch.accessor('h')} label={l.t('_c.color.hue')} ref={el => rh = el}
                disabled={!!this.#h} value={v => `${v.toFixed(2)}`} min={0} max={360} step={0.01} />
            <Range fitHeight accessor={this.#oklch.accessor('a')} label={l.t('_c.color.alpha')} ref={el => ra = el}
                disabled={!!this.#a} value={v => `${v.toFixed(2)}`} min={0} max={1} step={0.01} />
        </div>;
    }
}

function fmtOKLCH(l: number, c: number, h: number, a: number): string {
    return new Color('oklch', [l, c, h], a).toString();
}
