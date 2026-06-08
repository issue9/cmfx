// SPDX-FileCopyrightText: 2025-2026 caixw
//
// SPDX-License-Identifier: MIT

import { Form, type MountProps, Time } from '@cmfx/components';
import { createSignal, type JSX } from 'solid-js';
import { Portal } from 'solid-js/web';

import { boolSelector, layoutSelector, paletteSelector } from '@docs/components/base';

export default function (props: MountProps): JSX.Element {
	const ac = createSignal<Date | undefined>(new Date('2024-01-02T15:34'));

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

			<Form.Field help="help text" layout={layout()} label="label">
				<Time.Root
					popover="hover"
					placeholder="placeholder"
					palette={palette()}
					rounded={rounded()}
					readonly={readonly()}
					disabled={disabled()}
					value={ac[0]()}
					onChange={v => ac[1](v)}
				/>
			</Form.Field>
			<p>{ac[0]()?.toString()}</p>
		</div>
	);
}
