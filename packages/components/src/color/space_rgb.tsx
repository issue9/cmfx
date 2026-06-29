// SPDX-FileCopyrightText: 2025-2026 caixw
//
// SPDX-License-Identifier: MIT

import Color from 'colorjs.io';
import { type JSX, onMount, untrack } from 'solid-js';

import { useLocale } from '@components/context';
import { Form } from '@components/form';
import { Slider } from '@components/slider';
import type { Accessor, ColorSpace } from './space';
import { var2Color } from './space_vars';
import styles from './style.module.css';

type RGB = {
	r: number | null;
	g: number | null;
	b: number | null;
	a: number | null;
};

/**
 * RGB 的 {@link ColorSpace} 实现
 */
export class RGBSpace implements ColorSpace {
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

	panel(props: { s: Accessor; parent: HTMLElement }): JSX.Element {
		let rRef: Slider.Ref;
		let gRef: Slider.Ref;
		let bRef: Slider.Ref;
		let aRef: Slider.Ref;

		const c = new Color(var2Color(props.parent, untrack(props.s.getValue)) ?? 'rgb(1 1 1)').to('srgb');
		const [F, Field, api] = Form.create<RGB>({
			initValue: { r: this.#r ?? c.r, g: this.#g ?? c.g, b: this.#b ?? c.b, a: this.#a ?? c.a },
		});

		onMount(() => {
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
		});

		api.onChange(store => {
			const rr = store.r;
			const gg = store.g;
			const bb = store.b;
			const aa = store.a;
			props.s.setValue(fmtRGB(rr, gg, bb, aa));

			aRef.input().style.background = `linear-gradient(to right, ${fmtRGB(rr, gg, bb, 0)},
                ${fmtRGB(rr, gg, bb, 0.1)},${fmtRGB(rr, gg, bb, 0.2)},${fmtRGB(rr, gg, bb, 0.3)},${fmtRGB(rr, gg, bb, 0.4)},
                ${fmtRGB(rr, gg, bb, 0.5)},${fmtRGB(rr, gg, bb, 0.6)},${fmtRGB(rr, gg, bb, 0.7)},${fmtRGB(rr, gg, bb, 0.8)},
                ${fmtRGB(rr, gg, bb, 0.9)}, ${fmtRGB(rr, gg, bb, 1)})`;
			aRef.input().style.backgroundClip = 'padding-box';
		});

		const l = useLocale();
		return (
			<F class={styles.rgb} layout="vertical">
				<Field label={l.t('_c.color.red')} name="r">
					<Slider
						fitHeight
						disabled={!!this.#r}
						ref={el => (rRef = el)}
						format={v => `${v ? (100 * v).toFixed(2) : 0}%`}
						min={0}
						max={1}
						step={0.01}
					/>
				</Field>

				<Field label={l.t('_c.color.green')} name="g">
					<Slider
						fitHeight
						disabled={!!this.#g}
						ref={el => (gRef = el)}
						format={v => `${v ? (100 * v).toFixed(2) : 0}%`}
						min={0}
						max={1}
						step={0.01}
					/>
				</Field>

				<Field label={l.t('_c.color.blue')} name="b">
					<Slider
						fitHeight
						disabled={!!this.#b}
						ref={el => (bRef = el)}
						format={v => `${v ? (100 * v).toFixed(2) : 0}%`}
						min={0}
						max={1}
						step={0.01}
					/>
				</Field>

				<Field label={l.t('_c.color.alpha')} name="a">
					<Slider
						fitHeight
						disabled={!!this.#a}
						ref={el => (aRef = el)}
						format={v => `${v ? v.toFixed(2) : 0}`}
						min={0}
						max={1}
						step={0.01}
					/>
				</Field>
			</F>
		);
	}
}

function fmtRGB(r: number | null, g: number | null, b: number | null, a: number | null): string {
	return new Color('srgb', [r, g, b], a).toString();
}
