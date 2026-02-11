// SPDX-FileCopyrightText: 2025-2026 caixw
//
// SPDX-License-Identifier: MIT

import Color from 'colorjs.io';
import { createEffect, JSX, Signal } from 'solid-js';

import { useLocale } from '@components/context';
import { ObjectAccessor, Range, RangeRef } from '@components/form';
import { PickerPanel } from './picker';
import styles from './style.module.css';

type RGB = {
	r: number;
	g: number;
	b: number;
	a: number;
};

/**
 * RGB 的 {@link PickerPanel} 实现
 */
export class RGBPickerPanel implements PickerPanel {
	readonly #rgb: ObjectAccessor<RGB>;
	readonly #r?: number;
	readonly #g?: number;
	readonly #b?: number;
	readonly #a?: number;

	/**
	 * 构造函数
	 *
	 * @param r - 如果指定了非 undefined 的值，表示将 r 固定为此值，无法修改，取值范围 [0,1]；
	 * @param g - 如果指定了非 undefined 的值，表示将 g 固定为此值，无法修改，取值范围 [0,1]；
	 * @param b - 如果指定了非 undefined 的值，表示将 b 固定为此值，无法修改，取值范围 [0,1]；
	 * @param a - 如果指定了非 undefined 的值，表示将 a 固定为此值，无法修改，取值范围 [0,1]；
	 */
	constructor(r?: number, g?: number, b?: number, a?: number) {
		this.#rgb = new ObjectAccessor<RGB>({ r: r ?? 1, g: g ?? 1, b: b ?? 1, a: a ?? 1 });
		this.#r = r;
		this.#g = g;
		this.#b = b;
		this.#a = a;
	}

	get id(): string {
		return 'rgb';
	}

	get localeID(): string {
		return '_c.color.rgb';
	}

	include(value: string): boolean {
		return value.startsWith('rgb(');
	}

	panel(signal: Signal<string>): JSX.Element {
		let rRef: RangeRef;
		let gRef: RangeRef;
		let bRef: RangeRef;
		let aRef: RangeRef;

		createEffect(() => {
			const store = this.#rgb.getValue();
			const rr = store.r;
			const gg = store.g;
			const bb = store.b;
			const aa = store.a;
			signal[1](fmtRGB(rr, gg, bb, aa));

			rRef.input().style.background = `linear-gradient(to right, ${fmtRGB(0, 0, 0, 1)},
                ${fmtRGB(0.1, 0, 0, 1)},${fmtRGB(0.2, 0, 0, 1)},${fmtRGB(0.3, 0, 0, 1)},${fmtRGB(0.4, 0, 0, 1)},
                ${fmtRGB(0.5, 0, 0, 1)},${fmtRGB(0.6, 0, 0, 1)},${fmtRGB(0.7, 0, 0, 1)},${fmtRGB(0.8, 0, 0, 1)},
                ${fmtRGB(0.9, 0, 0, 1)},${fmtRGB(1, 0, 0, 1)})`;
			rRef.input().style.backgroundClip = 'padding-box';

			gRef.input().style.background = `linear-gradient(to right, ${fmtRGB(0, 0, 0, 1)},
                ${fmtRGB(0, 0.1, 0, 1)},${fmtRGB(0, 0.2, 0, 1)},${fmtRGB(0, 0.3, 0, 1)},${fmtRGB(0, 0.4, 0, 1)},
                ${fmtRGB(0, 0.5, 0, 1)},${fmtRGB(0, 0.6, 0, 1)},${fmtRGB(0, 0.7, 0, 1)},${fmtRGB(0, 0.8, 0, 1)},
                ${fmtRGB(0, 0.9, 0, 1)},${fmtRGB(0, 1, 0, 1)})`;
			gRef.input().style.backgroundClip = 'padding-box';

			bRef.input().style.background = `linear-gradient(to right, ${fmtRGB(0, 0, 0, 1)},
                ${fmtRGB(0, 0, 0.1, 1)},${fmtRGB(0, 0, 0.2, 1)},${fmtRGB(0, 0, 0.3, 1)},${fmtRGB(0, 0, 0.4, 1)},
                ${fmtRGB(0, 0, 0.5, 1)},${fmtRGB(0, 0, 0.6, 1)},${fmtRGB(0, 0, 0.7, 1)},${fmtRGB(0, 0, 0.8, 1)},
                ${fmtRGB(0, 0, 0.9, 1)},${fmtRGB(0, 0, 1, 1)})`;
			bRef.input().style.backgroundClip = 'padding-box';

			aRef.input().style.background = `linear-gradient(to right, ${fmtRGB(rr, gg, bb, 0)},
                ${fmtRGB(rr, gg, bb, 0.1)},${fmtRGB(rr, gg, bb, 0.2)},${fmtRGB(rr, gg, bb, 0.3)},${fmtRGB(rr, gg, bb, 0.4)},
                ${fmtRGB(rr, gg, bb, 0.5)},${fmtRGB(rr, gg, bb, 0.6)},${fmtRGB(rr, gg, bb, 0.7)},${fmtRGB(rr, gg, bb, 0.8)},
                ${fmtRGB(rr, gg, bb, 0.9)}, ${fmtRGB(rr, gg, bb, 1)})`;
			aRef.input().style.backgroundClip = 'padding-box';
		});

		const l = useLocale();
		return (
			<div class={styles.rgb}>
				<Range
					fitHeight
					label={l.t('_c.color.red')}
					accessor={this.#rgb.accessor('r')}
					disabled={!!this.#r}
					ref={el => {
						rRef = el;
					}}
					min={0}
					max={1}
					step={0.01}
				/>
				<Range
					fitHeight
					label={l.t('_c.color.green')}
					accessor={this.#rgb.accessor('g')}
					disabled={!!this.#g}
					ref={el => {
						el.input().classList.add(styles.bg);
						gRef = el;
					}}
					min={0}
					max={1}
					step={0.01}
				/>
				<Range
					fitHeight
					label={l.t('_c.color.blue')}
					accessor={this.#rgb.accessor('b')}
					disabled={!!this.#b}
					ref={el => {
						el.input().classList.add(styles.bg);
						bRef = el;
					}}
					min={0}
					max={1}
					step={0.01}
				/>
				<Range
					fitHeight
					label={l.t('_c.color.alpha')}
					accessor={this.#rgb.accessor('a')}
					disabled={!!this.#a}
					ref={el => {
						el.input().classList.add(styles.bg);
						aRef = el;
					}}
					min={0}
					max={1}
					step={0.01}
				/>
			</div>
		);
	}
}

function fmtRGB(r: number, g: number, b: number, a: number): string {
	return new Color('srgb', [r, g, b], a).toString();
}
