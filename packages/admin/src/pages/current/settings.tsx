// SPDX-FileCopyrightText: 2024-2026 caixw
//
// SPDX-License-Identifier: MIT

import {
	Alert,
	Checkbox,
	fieldAccessor,
	joinClass,
	Page,
	RadioGroup,
	Slider,
	useLocale,
	Settings as XSettings,
} from '@cmfx/components';
import { createSignal, JSX } from 'solid-js';
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

	const layout = fieldAccessor('layout', lay.layout());
	const float = lay.float();
	const width = fieldAccessor('width', lay.width());
	const [rangDisabled, setRangeDisabled] = createSignal(lay.width()[0]() < 640);
	width.onChange(v => {
		if (v < 640) {
			setRangeDisabled(true);
			width.setValue(0);
		}
	});

	const chk = (
		<Checkbox.Root
			label={l.t('_p.current.setWidth')}
			checked={!rangDisabled()}
			onChange={v => {
				setRangeDisabled(!v);
				width.setValue(v ? window.screen.width : 0);
			}}
		/>
	);

	return (
		<Page.Root title="_p.current.settings" class={joinClass(undefined, styles.settings)}>
			<XSettings.Root onReset={() => lay.reset()}>
				<Alert.Root type="warning" title={l.t('_p.current.settingsDesc')} />

				<XSettings.Separator />

				<XSettings.Item icon={<IconLayout />} title={l.t('_p.current.layout')} desc={l.t('_p.current.layoutDesc')}>
					<div class={styles.content}>
						<RadioGroup.Root
							class={styles.layout}
							block
							accessor={layout}
							options={[
								{ value: 'horizontal', label: <IconHorizontal class="text-8xl" /> },
								{ value: 'vertical', label: <IconVertical class="text-8xl" /> },
							]}
						/>

						<Checkbox.Root label={l.t('_p.current.float')} checked={float[0]()} onChange={v => float[1](!!v)} />

						<Slider.Root
							label={chk}
							disabled={rangDisabled()}
							step={10}
							max={window.screen.width}
							accessor={width}
							class={styles.range}
							value={v => `${v}px`}
						/>
					</div>
				</XSettings.Item>

				<XSettings.Separator />
			</XSettings.Root>
		</Page.Root>
	);
}
