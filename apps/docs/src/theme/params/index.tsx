// SPDX-FileCopyrightText: 2025-2026 caixw
//
// SPDX-License-Identifier: MIT

import type { Menu } from '@cmfx/components';
import { Button, ButtonGroup, Code, Dialog, Dropdown, Label, Notify, useLocale, useOptions } from '@cmfx/components';
import { rand } from '@cmfx/core';
import { joinClass } from '@cmfx/themes';
import { createMemo, type JSX } from 'solid-js';
import { unwrap } from 'solid-js/store';
import IconApply from '~icons/fluent/text-change-accept-20-filled';
import IconLoad from '~icons/material-symbols/arrow-upload-progress';
import IconExport from '~icons/material-symbols/export-notes';
import IconRand from '~icons/mingcute/random-fill';

import { convertSchemeVar2Color, type SchemeStore } from '@docs/theme/utils';
import { colorsParams, fmtColor } from './colors';
import { radiusParams, radiusValues } from './radius';
import styles from './style.module.css';
import { cssVarsParams } from './vars';

/**
 * 参数面板
 */
export function Params(props: { s: SchemeStore }): JSX.Element {
	const l = useLocale();
	const [act, opt] = useOptions();
	let dlg: Dialog.Ref;

	const schemes = Array.from(opt.schemes).map(s => {
		return { type: 'item', value: s[0], label: s[0] };
	}) satisfies Array<Menu.Item>;

	const source = createMemo(() => JSON.stringify(props.s[0], null, 4));

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
								if (!e) {
									return;
								}

								const obj = opt.schemes.get(e);
								if (!obj) {
									Notify.notify(l.t('_d.theme.predefinedSchemesNotFound', { name: e }));
									return;
								}
								props.s[1](convertSchemeVar2Color(unwrap(obj)));
							}}
						>
							<Button kind="border" square title={l.t('_d.theme.loadPredefinedSchemes')}>
								<IconLoad />
							</Button>
						</Dropdown>
						<Button square title={l.t('_d.theme.generateScheme')} onclick={() => random(props.s)}>
							<IconRand />
						</Button>
					</ButtonGroup>
				</div>

				<ButtonGroup kind="border">
					<Button square onclick={async () => act.setScheme(unwrap(props.s[0]))} title={l.t('_d.theme.apply')}>
						<IconApply />
					</Button>
					<Button square onclick={() => dlg.root().showModal()} title={l.t('_d.theme.export')}>
						<IconExport />
					</Button>
				</ButtonGroup>
			</div>

			<div class={styles.ps}>
				{colorsParams(l, props.s)}
				{radiusParams(l, props.s)}
				{cssVarsParams(l, props.s)}
			</div>

			<Dialog
				class="h-1/3"
				ref={el => (dlg = el)}
				mount={document.body}
				header={
					<Dialog.Toolbar movable close>
						<Label icon={<IconExport />}>{l.t('_d.theme.export')}</Label>
					</Dialog.Toolbar>
				}
			>
				<Code lang="json" class="h-full" ln={0} decorates={[Code.copyButtonDecorate]}>
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
