// SPDX-FileCopyrightText: 2025-2026 caixw
//
// SPDX-License-Identifier: MIT

import { Divider, Form, Slider } from '@cmfx/components';
import type { Locale } from '@cmfx/core';
import type { Palette } from '@cmfx/themes';
import Color from 'colorjs.io';
import { createEffect, createSignal, type JSX } from 'solid-js';
import IconColors from '~icons/material-symbols/colors';

import type { SchemeStore } from '@docs/theme/utils';
import styles from './style.module.css';

/**
 * 颜色选择参数面板
 */
export function colorsParams(l: Locale, s: SchemeStore): JSX.Element {
	return (
		<div class={styles.param}>
			<Divider>
				<IconColors class="me-1" />
				{l.t('_d.theme.colors')}
			</Divider>
			<PalettePicker palette="primary" schemes={s} />
			<PalettePicker palette="secondary" schemes={s} />
			<PalettePicker palette="tertiary" schemes={s} />
			<PalettePicker palette="error" schemes={s} />
			<PalettePicker palette="surface" schemes={s} />
		</div>
	);
}

function PalettePicker(props: { palette: Palette; schemes: SchemeStore }): JSX.Element {
	let rangeRef: Slider.Ref;
	const palette = props.schemes[0][props.palette];

	const c = new Color(palette || 'transparent');
	const [hue, setHue] = createSignal<number>(c.h!);
	createEffect(() => {
		c.h = hue();
		props.schemes[1](props.palette, c.toString());
	});

	createEffect(() => {
		const c = new Color(props.schemes[0][props.palette]);

		rangeRef.input().style.background = `linear-gradient(to right, ${fmtColor(c.l, c.c, 0)},
            ${fmtColor(c.l, c.c, 20)}, ${fmtColor(c.l, c.c, 40)}, ${fmtColor(c.l, c.c, 60)},
            ${fmtColor(c.l, c.c, 80)}, ${fmtColor(c.l, c.c, 100)}, ${fmtColor(c.l, c.c, 120)},
            ${fmtColor(c.l, c.c, 140)}, ${fmtColor(c.l, c.c, 160)}, ${fmtColor(c.l, c.c, 180)},
            ${fmtColor(c.l, c.c, 200)}, ${fmtColor(c.l, c.c, 220)}, ${fmtColor(c.l, c.c, 240)},
            ${fmtColor(c.l, c.c, 260)}, ${fmtColor(c.l, c.c, 280)}, ${fmtColor(c.l, c.c, 300)},
            ${fmtColor(c.l, c.c, 320)}, ${fmtColor(c.l, c.c, 340)}, ${fmtColor(c.l, c.c, 360)})`;

		setHue(c.h!);
	});

	return (
		<Form.Field layout="vertical" label={props.palette}>
			<Slider min={0} max={360} step={0.01} fitHeight ref={el => (rangeRef = el)} value={hue()} onChange={setHue} />
		</Form.Field>
	);
}

export function fmtColor(l: Color['l'], c: Color['l'], h: Color['l']): string {
	return `oklch(${l} ${c} ${h})`;
}
