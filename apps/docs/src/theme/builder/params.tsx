// SPDX-FileCopyrightText: 2025-2026 caixw
//
// SPDX-License-Identifier: MIT

import type { Menu, Palette, Scheme } from '@cmfx/components';
import {
	Button,
	ButtonGroup,
	Code,
	Dialog,
	Divider,
	Dropdown,
	Form,
	joinClass,
	Label,
	Notify,
	RadioGroup,
	Slider,
	useLocale,
	useOptions,
} from '@cmfx/components';
import { type Locale, rand } from '@cmfx/core';
import Color from 'colorjs.io';
import { createEffect, createMemo, createSignal, type JSX } from 'solid-js';
import { unwrap } from 'solid-js/store';
import IconApply from '~icons/fluent/text-change-accept-20-filled';
import IconLoad from '~icons/material-symbols/arrow-upload-progress';
import IconColors from '~icons/material-symbols/colors';
import IconExport from '~icons/material-symbols/export-notes';
import IconRadius from '~icons/mingcute/border-radius-fill';
import IconRand from '~icons/mingcute/random-fill';

import styles from './style.module.css';
import { convertSchemeVar2Color, type SchemeStore } from './utils';

/**
 * 参数面板
 */
export function params(s: SchemeStore): JSX.Element {
	const l = useLocale();
	const [act, opt] = useOptions();
	let dlg: Dialog.Ref;

	const schemes = Array.from(opt.schemes).map(s => {
		return { type: 'item', value: s[0], label: s[0] };
	}) as Array<Menu.MenuItem>;

	const source = createMemo(() => JSON.stringify(s[0], null, 4));

	return (
		<div class={styles.params}>
			<div class={joinClass('primary', styles.toolbar)}>
				<div class={styles.actions}>
					<ButtonGroup kind="border">
						<Dropdown
							trigger="click"
							selectedClass=""
							items={schemes}
							onChange={e => {
								const obj = opt.schemes.get(e);
								if (!obj) {
									Notify.notify(l.t('_d.theme.predefinedSchemesNotFound', { name: e }));
									return;
								}
								s[1](convertSchemeVar2Color(unwrap(obj)));
							}}
						>
							<Button kind="border" square title={l.t('_d.theme.loadPredefinedSchemes')}>
								<IconLoad />
							</Button>
						</Dropdown>
						<Button square title={l.t('_d.theme.generateScheme')} onclick={() => random(s)}>
							<IconRand />
						</Button>
					</ButtonGroup>
				</div>

				<ButtonGroup kind="border">
					<Button square onclick={async () => act.setScheme(unwrap(s[0]))} title={l.t('_d.theme.apply')}>
						<IconApply />
					</Button>
					<Button square onclick={() => dlg.root().showModal()} title={l.t('_d.theme.export')}>
						<IconExport />
					</Button>
				</ButtonGroup>
			</div>

			<div class={styles.ps}>
				{colorsParams(l, s)}
				{radiusParams(l, s)}
			</div>

			<Dialog
				class="h-1/3"
				ref={el => (dlg = el)}
				header={
					<Dialog.Toolbar movable close>
						<Label icon={<IconExport />}>{l.t('_d.theme.export')}</Label>
					</Dialog.Toolbar>
				}
			>
				<Code lang="json" class="h-full" ln={0} decorates={['copy-button']}>
					{source()}
				</Code>
			</Dialog>
		</div>
	);
}

/**
 * 生成随机参数
 */
export function random(s: SchemeStore) {
	let h = rand(0, 360, 2);
	const error = fmtColor(1, 0.4, h);

	h = rand((h + 20) % 360, 360, 2);
	const primary = fmtColor(1, 0.4, h);

	h = rand((h + 20) % 360, 360, 2);
	const secondary = fmtColor(1, 0.4, h);

	h = rand((h + 20) % 360, 360, 2);
	const tertiary = fmtColor(1, 0.4, h);

	h = rand((h + 20) % 360, 360, 2);
	const surface = fmtColor(1, 0.4, h);

	s[1](() => ({
		error,
		primary,
		secondary,
		tertiary,
		surface,
		radius: {
			xs: radiusValues[rand(0, radiusValues.length, 0)],
			sm: radiusValues[rand(0, radiusValues.length, 0)],
			md: radiusValues[rand(0, radiusValues.length, 0)],
			lg: radiusValues[rand(0, radiusValues.length, 0)],
			xl: radiusValues[rand(0, radiusValues.length, 0)],
		},
	}));
}

// 设置圆角孤度参数面板
function radiusParams(l: Locale, s: SchemeStore): JSX.Element {
	return (
		<div class={styles.param}>
			<Divider>
				<IconRadius class="me-1" />
				{l.t('_d.theme.radius')}
			</Divider>
			{radius('xs', s, 'xs')}
			{radius('sm', s, 'sm')}
			{radius('md', s, 'md')}
			{radius('lg', s, 'lg')}
			{radius('xl', s, 'xl')}
		</div>
	);
}

// 可用的圆角值
const radiusValues = [0, 0.25, 0.5, 1, 1.5, 2] as const;

function radius(title: string, s: SchemeStore, a: keyof Scheme['radius']): JSX.Element {
	const radiusLabel = (radius: number): JSX.Element => {
		return (
			<div class={styles.btns}>
				<div style={{ 'border-top-left-radius': `${radius}rem` }} />
			</div>
		);
	};

	return (
		<div class={styles.radius}>
			<Form.Field label={<span class={styles.title}>{title}</span>}>
				<RadioGroup
					class="w-full"
					value={s[0].radius[a]}
					onChange={v => s[1]('radius', a, v!)}
					block
					options={radiusValues.map(v => ({ value: v, label: radiusLabel(v) }))}
				/>
			</Form.Field>
		</div>
	);
}

// 颜色选择参数面板
function colorsParams(l: Locale, s: SchemeStore): JSX.Element {
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

	const c = new Color(palette ?? 'transparent');
	const [hue, setHue] = createSignal<number>(c.h!);
	createEffect(() => {
		c.h = hue();
		props.schemes[1]({ [props.palette]: c.toString() });
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
			<Slider
				min={0}
				max={360}
				step={0.01}
				fitHeight
				ref={el => (rangeRef = el)}
				value={hue()}
				onChange={setHue}
			/>
		</Form.Field>
	);
}

function fmtColor(l: Color['l'], c: Color['l'], h: Color['l']): string {
	return `oklch(${l} ${c} ${h})`;
}
