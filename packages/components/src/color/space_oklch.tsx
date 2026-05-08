// SPDX-FileCopyrightText: 2025-2026 caixw
//
// SPDX-License-Identifier: MIT

import Color from 'colorjs.io';
import { createEffect, type JSX } from 'solid-js';

import { useLocale } from '@components/context';
import { Form } from '@components/form';
import { Slider } from '@components/slider';
import type { Accessor, Space } from './space';
import styles from './style.module.css';

type OKLCH = {
	l: number;
	c: number;
	h: number;
	a: number;
};

/**
 * OKLCH 的 {@link Space} 实现
 */
export class OKLCHSpace implements Space {
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
		this.#l = l;
		this.#c = c;
		this.#h = h;
		this.#a = a;
	}

	get id(): string {
		return 'oklch';
	}

	get localeID(): string {
		return '_c.color.oklch';
	}

	include(value: string): boolean {
		return value.startsWith('oklch(');
	}

	panel(access: Accessor): JSX.Element {
		let rl: Slider.RootRef;
		let rc: Slider.RootRef;
		let rh: Slider.RootRef;
		let ra: Slider.RootRef;

		const [F, Field, api] = Form.create<OKLCH>({
			initValue: { l: this.#l ?? 1, c: this.#c ?? 0.4, h: this.#h ?? 1, a: this.#a ?? 1 },
		});

		createEffect(() => {
			// 根据值改变背景颜色
			const store = api.getValue();
			const ll = store.l;
			const cc = store.c;
			const hh = store.h;
			const aa = store.a;
			access.setValue(fmtOKLCH(ll, cc, hh, aa));

			rl.input().style.background = `linear-gradient(to right, ${fmtOKLCH(0, cc, hh, aa)},
                        ${fmtOKLCH(0.1, cc, hh, aa)}, ${fmtOKLCH(0.2, cc, hh, aa)}, ${fmtOKLCH(0.3, cc, hh, aa)},
                        ${fmtOKLCH(0.4, cc, hh, aa)}, ${fmtOKLCH(0.5, cc, hh, aa)}, ${fmtOKLCH(0.6, cc, hh, aa)},
                        ${fmtOKLCH(0.7, cc, hh, aa)}, ${fmtOKLCH(0.8, cc, hh, aa)}, ${fmtOKLCH(0.9, cc, hh, aa)},
                        ${fmtOKLCH(1, cc, hh, aa)})`;
			rl.input().style.backgroundClip = 'padding-box';

			rc.input().style.background = `linear-gradient(to right, ${fmtOKLCH(ll, 0, hh, aa)},
                        ${fmtOKLCH(ll, 0.04, hh, aa)}, ${fmtOKLCH(ll, 0.08, hh, aa)}, ${fmtOKLCH(ll, 0.12, hh, aa)},
                        ${fmtOKLCH(ll, 0.16, hh, aa)}, ${fmtOKLCH(ll, 0.2, hh, aa)}, ${fmtOKLCH(ll, 0.24, hh, aa)},
                        ${fmtOKLCH(ll, 0.28, hh, aa)}, ${fmtOKLCH(ll, 0.32, hh, aa)}, ${fmtOKLCH(ll, 0.36, hh, aa)},
                        ${fmtOKLCH(ll, 0.4, hh, aa)})`;
			rc.input().style.backgroundClip = 'padding-box';

			rh.input().style.background = `linear-gradient(to right, ${fmtOKLCH(ll, cc, 0, aa)},
                        ${fmtOKLCH(ll, cc, 20, aa)}, ${fmtOKLCH(ll, cc, 40, aa)}, ${fmtOKLCH(ll, cc, 60, aa)},
                        ${fmtOKLCH(ll, cc, 80, aa)}, ${fmtOKLCH(ll, cc, 100, aa)}, ${fmtOKLCH(ll, cc, 120, aa)},
                        ${fmtOKLCH(ll, cc, 140, aa)}, ${fmtOKLCH(ll, cc, 160, aa)}, ${fmtOKLCH(ll, cc, 180, aa)},
                        ${fmtOKLCH(ll, cc, 200, aa)}, ${fmtOKLCH(ll, cc, 220, aa)}, ${fmtOKLCH(ll, cc, 240, aa)},
                        ${fmtOKLCH(ll, cc, 260, aa)}, ${fmtOKLCH(ll, cc, 280, aa)}, ${fmtOKLCH(ll, cc, 300, aa)},
                        ${fmtOKLCH(ll, cc, 320, aa)}, ${fmtOKLCH(ll, cc, 340, aa)}, ${fmtOKLCH(ll, cc, 360, aa)})`;
			rh.input().style.backgroundClip = 'padding-box';

			ra.input().style.background = `linear-gradient(to right, ${fmtOKLCH(ll, cc, hh, 0)},
                        ${fmtOKLCH(ll, cc, hh, 0.1)}, ${fmtOKLCH(ll, cc, hh, 0.2)}, ${fmtOKLCH(ll, cc, hh, 0.3)},
                        ${fmtOKLCH(ll, cc, hh, 0.4)}, ${fmtOKLCH(ll, cc, hh, 0.5)}, ${fmtOKLCH(ll, cc, hh, 0.6)},
                        ${fmtOKLCH(ll, cc, hh, 0.7)}, ${fmtOKLCH(ll, cc, hh, 0.8)}, ${fmtOKLCH(ll, cc, hh, 0.9)},
                        ${fmtOKLCH(ll, cc, hh, 1)})`;
			ra.input().style.backgroundClip = 'padding-box';
		});

		const l = useLocale();

		return (
			<F class={styles.oklch}>
				<Field label={l.t('_c.color.lightness')} name="l">
					<Slider.Root
						fitHeight
						ref={el => (rl = el)}
						disabled={!!this.#l}
						format={v => `${(v ?? 0 * 100).toFixed(4)}%`}
						min={0}
						max={1}
						step={0.0001}
					/>
				</Field>

				<Field label={l.t('_c.color.chroma')} name="c">
					<Slider.Root
						fitHeight
						ref={el => (rc = el)}
						disabled={!!this.#c}
						format={v => `${v ? v.toFixed(2) : 0}`}
						min={0}
						max={0.4}
						step={0.01}
					/>
				</Field>

				<Field label={l.t('_c.color.hue')} name="h">
					<Slider.Root
						fitHeight
						ref={el => (rh = el)}
						disabled={!!this.#h}
						format={v => `${v ? v.toFixed(2) : 0}`}
						min={0}
						max={360}
						step={0.01}
					/>
				</Field>

				<Field label={l.t('_c.color.alpha')} name="a">
					<Slider.Root
						fitHeight
						ref={el => (ra = el)}
						disabled={!!this.#a}
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

function fmtOKLCH(l: number, c: number, h: number, a: number): string {
	return new Color('oklch', [l, c, h], a).toString();
}
