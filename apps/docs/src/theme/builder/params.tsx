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
import { type ExpandType, type Locale, rand } from '@cmfx/core';
import Color from 'colorjs.io';
import { batch, createEffect, createMemo, type JSX } from 'solid-js';
import { unwrap } from 'solid-js/store';
import IconApply from '~icons/fluent/text-change-accept-20-filled';
import IconLoad from '~icons/material-symbols/arrow-upload-progress';
import IconColors from '~icons/material-symbols/colors';
import IconExport from '~icons/material-symbols/export-notes';
import IconRadius from '~icons/mingcute/border-radius-fill';
import IconRand from '~icons/mingcute/random-fill';

import styles from './style.module.css';
import { convertSchemeVar2Color } from './utils';

/**
 * 参数面板
 */
export function params(s: Form.ObjectAccessor<ExpandType<Scheme>>): JSX.Element {
	const l = useLocale();
	const [act, opt] = useOptions();
	let dlg: Dialog.RootRef;

	const schemes = Array.from(opt.schemes).map(s => {
		return { type: 'item', value: s[0], label: s[0] };
	}) as Array<Menu.MenuItem>;

	const source = createMemo(() => JSON.stringify(s.getValue(), null, 4));

	return (
		<div class={styles.params}>
			<div class={joinClass('primary', styles.toolbar)}>
				<div class={styles.actions}>
					<ButtonGroup.Root kind="border">
						<Dropdown.Root
							trigger="click"
							selectedClass=""
							items={schemes}
							onChange={e => {
								const obj = opt.schemes.get(e);
								if (!obj) {
									Notify.notify(l.t('_d.theme.predefinedSchemesNotFound', { name: e }));
									return;
								}
								s.setValue(convertSchemeVar2Color(unwrap(obj)));
							}}
						>
							<Button.Root kind="border" square title={l.t('_d.theme.loadPredefinedSchemes')}>
								<IconLoad />
							</Button.Root>
						</Dropdown.Root>
						<Button.Root square title={l.t('_d.theme.generateScheme')} onclick={() => random(s)}>
							<IconRand />
						</Button.Root>
					</ButtonGroup.Root>
				</div>

				<ButtonGroup.Root kind="border">
					<Button.Root square onclick={async () => act.setScheme((await s.object())!)} title={l.t('_d.theme.apply')}>
						<IconApply />
					</Button.Root>
					<Button.Root square onclick={() => dlg.root().showModal()} title={l.t('_d.theme.export')}>
						<IconExport />
					</Button.Root>
				</ButtonGroup.Root>
			</div>

			<div class={styles.ps}>
				{colorsParams(l, s)}
				{radiusParams(l, s)}
			</div>

			<Dialog.Root
				class="h-1/2"
				ref={el => (dlg = el)}
				header={<Label.Root icon={<IconExport />}>{l.t('_d.theme.export')}</Label.Root>}
			>
				<Code.Root lang="json" class="h-full" ln={0}>
					{source()}
				</Code.Root>
			</Dialog.Root>
		</div>
	);
}

/**
 * 生成随机参数
 */
export function random(s: Form.ObjectAccessor<ExpandType<Scheme>>) {
	batch(() => {
		let h = rand(0, 360, 2);
		s.accessor<string>('error').setValue(fmtColor(1, 0.4, h));

		h = rand((h + 20) % 360, 360, 2);
		s.accessor<string>('primary').setValue(fmtColor(1, 0.4, h));

		h = rand((h + 20) % 360, 360, 2);
		s.accessor<string>('secondary').setValue(fmtColor(1, 0.4, h));

		h = rand((h + 20) % 360, 360, 2);
		s.accessor<string>('tertiary').setValue(fmtColor(1, 0.4, h));

		h = rand((h + 20) % 360, 360, 2);
		s.accessor<string>('surface').setValue(fmtColor(1, 0.4, h));

		s.accessor<number>('radius.xs').setValue(radiusValues[rand(0, radiusValues.length, 0)]);
		s.accessor<number>('radius.sm').setValue(radiusValues[rand(0, radiusValues.length, 0)]);
		s.accessor<number>('radius.md').setValue(radiusValues[rand(0, radiusValues.length, 0)]);
		s.accessor<number>('radius.lg').setValue(radiusValues[rand(0, radiusValues.length, 0)]);
		s.accessor<number>('radius.xl').setValue(radiusValues[rand(0, radiusValues.length, 0)]);
	});
}

// 设置圆角孤度参数面板
function radiusParams(l: Locale, s: Form.ObjectAccessor<ExpandType<Scheme>>): JSX.Element {
	return (
		<div class={styles.param}>
			<Divider.Root>
				<IconRadius class="me-1" />
				{l.t('_d.theme.radius')}
			</Divider.Root>
			{radius('xs', s.accessor<number>('radius.xs'))}
			{radius('sm', s.accessor<number>('radius.sm'))}
			{radius('md', s.accessor<number>('radius.md'))}
			{radius('lg', s.accessor<number>('radius.lg'))}
			{radius('xl', s.accessor<number>('radius.xl'))}
		</div>
	);
}

// 可用的圆角值
const radiusValues = [0, 0.25, 0.5, 1, 1.5, 2] as const;

function radius(title: string, a: Form.Accessor<number>): JSX.Element {
	const radiusLabel = (radius: number): JSX.Element => {
		return (
			<div class={styles.btns}>
				<div style={{ 'border-top-left-radius': `${radius}rem` }} />
			</div>
		);
	};

	return (
		<div class={styles.radius}>
			<RadioGroup.Root
				class="w-full"
				accessor={a}
				block
				label={<span class={styles.title}>{title}</span>}
				options={radiusValues.map(v => ({ value: v, label: radiusLabel(v) }))}
			/>
		</div>
	);
}

// 颜色选择参数面板
function colorsParams(l: Locale, s: Form.ObjectAccessor<ExpandType<Scheme>>): JSX.Element {
	return (
		<div class={styles.param}>
			<Divider.Root>
				<IconColors class="me-1" />
				{l.t('_d.theme.colors')}
			</Divider.Root>
			<PalettePicker palette="primary" schemes={s} />
			<PalettePicker palette="secondary" schemes={s} />
			<PalettePicker palette="tertiary" schemes={s} />
			<PalettePicker palette="error" schemes={s} />
			<PalettePicker palette="surface" schemes={s} />
		</div>
	);
}

function PalettePicker(props: { palette: Palette; schemes: Form.ObjectAccessor<ExpandType<Scheme>> }): JSX.Element {
	let rangeRef: Slider.RootRef;
	const schemesFA = props.schemes.accessor<string>(props.palette);

	const c = new Color(props.schemes.getValue()[props.palette]);
	const hueFA = Form.fieldAccessor<number>('hue', c.h!);
	hueFA.onChange(v => {
		const c = new Color(schemesFA.getValue());
		schemesFA.setValue(fmtColor(c.l, c.c, v));
	});

	createEffect(() => {
		const c = new Color(props.schemes.getValue()[props.palette]);

		rangeRef.input().style.background = `linear-gradient(to right, ${fmtColor(c.l, c.c, 0)},
            ${fmtColor(c.l, c.c, 20)}, ${fmtColor(c.l, c.c, 40)}, ${fmtColor(c.l, c.c, 60)},
            ${fmtColor(c.l, c.c, 80)}, ${fmtColor(c.l, c.c, 100)}, ${fmtColor(c.l, c.c, 120)},
            ${fmtColor(c.l, c.c, 140)}, ${fmtColor(c.l, c.c, 160)}, ${fmtColor(c.l, c.c, 180)},
            ${fmtColor(c.l, c.c, 200)}, ${fmtColor(c.l, c.c, 220)}, ${fmtColor(c.l, c.c, 240)},
            ${fmtColor(c.l, c.c, 260)}, ${fmtColor(c.l, c.c, 280)}, ${fmtColor(c.l, c.c, 300)},
            ${fmtColor(c.l, c.c, 320)}, ${fmtColor(c.l, c.c, 340)}, ${fmtColor(c.l, c.c, 360)})`;

		hueFA.setValue(c.h!);
	});

	return (
		<Slider.Root
			min={0}
			max={360}
			step={0.01}
			fitHeight
			ref={el => {
				rangeRef = el;
			}}
			layout="vertical"
			label={props.palette}
			accessor={hueFA}
			value={v => `${v.toFixed(2)}`}
		/>
	);
}

function fmtColor(l: Color['l'], c: Color['l'], h: Color['l']): string {
	return `oklch(${l} ${c} ${h})`;
}
