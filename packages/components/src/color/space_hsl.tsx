// SPDX-FileCopyrightText: 2025-2026 caixw
//
// SPDX-License-Identifier: MIT

import Color from 'colorjs.io';
import { createEffect, type JSX, untrack } from 'solid-js';

import { useLocale } from '@components/context';
import { Form } from '@components/form';
import { Slider } from '@components/slider';
import { type Accessor, alphaConverter, type ColorSpace } from './space';
import { var2Color } from './space_vars';
import styles from './style.module.css';

type HSL = {
	h: number | null;
	s: number | null;
	l: number | null;
	a: number | null;
};

/**
 * HSL 的 {@link ColorSpace} 实现
 */
export class HSLSpace implements ColorSpace {
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
		this.#h = h;
		this.#s = s;
		this.#l = l;
		this.#a = a;
	}

	get id(): string {
		return 'hsl';
	}

	get localeID(): string {
		return '_c.color.hsl';
	}

	include(value: string): boolean {
		return value.startsWith('hsl(');
	}

	panel(props: { s: Accessor; parent: HTMLElement }): JSX.Element {
		let hRef: Slider.Ref;
		let sRef: Slider.Ref;
		let lRef: Slider.Ref;
		let aRef: Slider.Ref;

		const c = new Color(var2Color(props.parent, untrack(props.s.getValue)) ?? 'hsl(180 50 50)').to('hsl');
		const [F, Field, api] = Form.create<HSL>({
			initValue: { h: this.#h ?? c.h, s: this.#s ?? c.s, l: this.#l ?? c.l, a: this.#a ?? c.a },
		});

		createEffect(() => {
			const store = api.getValue();
			const hh = store.h;
			const ss = store.s;
			const ll = store.l;
			const aa = store.a;
			props.s.setValue(fmtHSL(hh, ss, ll, aa));

			hRef.input().style.background = `linear-gradient(to right, ${fmtHSL(0, ss, ll, aa)},
                ${fmtHSL(20, ss, ll, aa)}, ${fmtHSL(40, ss, ll, aa)}, ${fmtHSL(60, ss, ll, aa)},
                ${fmtHSL(80, ss, ll, aa)}, ${fmtHSL(100, ss, ll, aa)}, ${fmtHSL(120, ss, ll, aa)},
                ${fmtHSL(140, ss, ll, aa)}, ${fmtHSL(160, ss, ll, aa)}, ${fmtHSL(180, ss, ll, aa)},
                ${fmtHSL(200, ss, ll, aa)}, ${fmtHSL(220, ss, ll, aa)}, ${fmtHSL(240, ss, ll, aa)},
                ${fmtHSL(260, ss, ll, aa)}, ${fmtHSL(280, ss, ll, aa)}, ${fmtHSL(300, ss, ll, aa)},
                ${fmtHSL(320, ss, ll, aa)}, ${fmtHSL(340, ss, ll, aa)}, ${fmtHSL(360, ss, ll, aa)})`;
			hRef.input().style.backgroundClip = 'padding-box';

			sRef.input().style.background = `linear-gradient(to right, ${fmtHSL(hh, 0, ll, aa)},
                ${fmtHSL(hh, 10, ll, aa)},${fmtHSL(hh, 20, ll, aa)},${fmtHSL(hh, 30, ll, aa)},${fmtHSL(hh, 40, ll, aa)},
                ${fmtHSL(hh, 50, ll, aa)},${fmtHSL(hh, 60, ll, aa)},${fmtHSL(hh, 70, ll, aa)},${fmtHSL(hh, 80, ll, aa)},
                ${fmtHSL(hh, 90, ll, aa)},${fmtHSL(hh, 100, ll, aa)})`;
			sRef.input().style.backgroundClip = 'padding-box';

			lRef.input().style.background = `linear-gradient(to right, ${fmtHSL(hh, ss, 0, aa)},
                ${fmtHSL(hh, ss, 10, aa)},${fmtHSL(hh, ss, 20, aa)},${fmtHSL(hh, ss, 30, aa)},${fmtHSL(hh, ss, 40, aa)},
                ${fmtHSL(hh, ss, 50, aa)},${fmtHSL(hh, ss, 60, aa)},${fmtHSL(hh, ss, 70, aa)},${fmtHSL(hh, ss, 80, aa)},
                ${fmtHSL(hh, ss, 90, aa)},${fmtHSL(hh, ss, 100, aa)})`;
			lRef.input().style.backgroundClip = 'padding-box';

			aRef.input().style.background = `linear-gradient(to right, ${fmtHSL(hh, ss, ll, 0)},
                ${fmtHSL(hh, ss, ll, 0.1)},${fmtHSL(hh, ss, ll, 0.2)},${fmtHSL(hh, ss, ll, 0.3)},${fmtHSL(hh, ss, ll, 0.4)},
                ${fmtHSL(hh, ss, ll, 0.5)},${fmtHSL(hh, ss, ll, 0.6)},${fmtHSL(hh, ss, ll, 0.7)},${fmtHSL(hh, ss, ll, 0.8)},
                ${fmtHSL(hh, ss, ll, 0.9)}, ${fmtHSL(hh, ss, ll, 1)})`;
			aRef.input().style.backgroundClip = 'padding-box';
		});

		const l = useLocale();

		return (
			<F class={styles.hsl} layout="vertical">
				<Field label={l.t('_c.color.hue')} name="h">
					<Slider
						disabled={!!this.#h}
						fitHeight
						ref={el => (hRef = el)}
						format={v => `${v ? v.toFixed(2) : 0}`}
						min={0}
						max={360}
						step={1}
					/>
				</Field>

				<Field label={l.t('_c.color.saturation')} name="s">
					<Slider
						disabled={!!this.#s}
						fitHeight
						ref={el => (sRef = el)}
						format={v => `${v ? v.toFixed(2) : 0}%`}
						min={0}
						max={100}
						step={0.01}
					/>
				</Field>

				<Field label={l.t('_c.color.lightness')} name="l">
					<Slider
						disabled={!!this.#l}
						fitHeight
						ref={el => (lRef = el)}
						format={v => `${v ? v.toFixed(2) : 0}%`}
						min={0}
						max={100}
						step={0.01}
					/>
				</Field>

				<Field label={l.t('_c.color.alpha')} name="a" conv={alphaConverter}>
					<Slider
						disabled={!!this.#a}
						fitHeight
						ref={el => (aRef = el)}
						format={v => `${v === undefined ? 1 : v.toFixed(2)}`}
						min={0}
						max={1}
						step={0.01}
						onChange={v => console.log(v)}
					/>
				</Field>
			</F>
		);
	}
}

function fmtHSL(h: number | null, s: number | null, l: number | null, a: number | null): string {
	return new Color('hsl', [h, s, l], a).toString();
}
