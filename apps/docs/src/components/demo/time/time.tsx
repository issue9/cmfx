// SPDX-FileCopyrightText: 2025-2026 caixw
//
// SPDX-License-Identifier: MIT

import { type MountProps, TimePicker } from '@cmfx/components';
import { createSignal, type JSX } from 'solid-js';
import { Portal } from 'solid-js/web';

import { boolSelector, layoutSelector, paletteSelector } from '@docs/components/base';

export default function (props: MountProps): JSX.Element {
	const ac = createSignal(new Date('2024-01-02T15:34'));

	const [Palette, palette] = paletteSelector();
	const [Disabled, disabled] = boolSelector('_d.demo.disabled');
	const [Readonly, readonly] = boolSelector('_d.demo.readonly');
	const [Layout, layout] = layoutSelector('_d.demo.componentLayout', 'horizontal');
	const [Rounded, rounded] = boolSelector('_d.demo.rounded', false);

	return (
		<div>
			<Portal mount={props.mount}>
				<Palette />
				<Readonly />
				<Rounded />
				<Disabled />
				<Layout />
			</Portal>

			<TimePicker.Root
				hasHelp
				placeholder="placeholder"
				layout={layout()}
				label="label"
				palette={palette()}
				rounded={rounded()}
				readonly={readonly()}
				disabled={disabled()}
				value={ac[0]()}
				onChange={val => ac[1](val)}
			/>
			<p>{ac[0]()}</p>
		</div>
	);
}
