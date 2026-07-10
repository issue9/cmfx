// SPDX-FileCopyrightText: 2024-2026 caixw
//
// SPDX-License-Identifier: MIT

import { Alert, Checkbox, Form, Page, RadioGroup, Slider, useLocale, Settings as XSettings } from '@cmfx/components';
import { joinClass } from '@cmfx/themes';
import { createEffect, createSignal, type JSX } from 'solid-js';
import IconLayout from '~icons/material-symbols/responsive-layout-rounded';
import IconHorizontal from '~icons/ph/square-split-horizontal-fill';
import IconVertical from '~icons/ph/square-split-vertical-fill';

import { useLayout } from '@admin/app';
import styles from './style.module.css';

/**
 * 设置页面
 */
export function Settings(): JSX.Element {
	const l = useLocale();
	const lay = useLayout();

	const [rangDisabled, setRangeDisabled] = createSignal(lay.width()[0]() < 640);
	createEffect(() => {
		const v = lay.width()[0]();
		if (v < 640) {
			setRangeDisabled(true);
			lay.width()[1](0);
		}
	});

	const chk = (
		<Checkbox
			label={l.t('_p.current.setWidth')}
			checked={!rangDisabled()}
			onChange={v => {
				setRangeDisabled(!v);
				lay.width()[1](v ? window.screen.width : 0);
			}}
		/>
	);

	return (
		<Page title="_p.current.settings" class={joinClass(undefined, styles.settings)}>
			<XSettings onReset={() => lay.reset()}>
				<Alert type="warning" title={l.t('_p.current.settingsDesc')} />

				<XSettings.Separator />

				<XSettings.Item icon={<IconLayout />} title={l.t('_p.current.layout')} desc={l.t('_p.current.layoutDesc')}>
					<div class={styles.content}>
						<RadioGroup
							class={styles.layout}
							block
							value={lay.layout()[0]()}
							onChange={v => lay.layout()[1](v!)}
							options={[
								{ value: 'horizontal', label: <IconHorizontal class="text-8xl" /> },
								{ value: 'vertical', label: <IconVertical class="text-8xl" /> },
							]}
						/>

						<Checkbox label={l.t('_p.current.float')} checked={lay.float()[0]()} onChange={v => lay.float()[1](!!v)} />

						<Form.Field label={chk} layout="horizontal">
							<Slider
								disabled={rangDisabled()}
								step={10}
								max={window.screen.width}
								value={lay.width()[0]()}
								onChange={v => lay.width()[1](v!)}
								class={styles.range}
								format={v => `${v}px`}
							/>
						</Form.Field>
					</div>
				</XSettings.Item>

				<XSettings.Separator />
			</XSettings>
		</Page>
	);
}
