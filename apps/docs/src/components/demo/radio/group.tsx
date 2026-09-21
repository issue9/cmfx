// SPDX-FileCopyrightText: 2024-2026 caixw
//
// SPDX-License-Identifier: MIT

import type { MountProps, Palette } from '@cmfx/cdk';
import { Form, RadioGroup } from '@cmfx/components';
import { createSignal, type JSX } from 'solid-js';
import { Portal } from 'solid-js/web';

import { boolSelector, layoutSelector, stateSelector } from '@docs/components/base';

export default function (props: MountProps): JSX.Element {
	const [palette, setPalette] = createSignal<Palette | undefined>('error');
	const [Rounded, rounded] = boolSelector('_d.demo.rounded');
	const [Layout, layout] = layoutSelector('_d.demo.componentLayout', 'horizontal');
	const [State, state] = stateSelector();
	const [ItemLayout, itemLayout] = layoutSelector('_d.demo.itemLayout', 'horizontal');
	const [Block, block] = boolSelector('_d.demo.block');

	const options: RadioGroup.Options<Palette> = [
		{ value: 'error', label: 'error' },
		{ value: 'secondary', label: 'secondary' },
		{ value: 'primary', label: 'primary' },
		{ value: 'surface', label: 'surface' },
	];

	const [F, Field] = Form.create({ initValue: { a: 'error' } });

	return (
		<>
			<Portal mount={props.mount}>
				<State />
				<Layout />
				<ItemLayout />
				<Block />
				<Rounded />
			</Portal>

			<F>
				<Field label="test" layout={layout()} palette={palette()} name="a">
					<RadioGroup
						layout={itemLayout()}
						options={options}
						onChange={v => setPalette(v)}
						rounded={rounded()}
						block={block()}
						state={state()}
					/>
				</Field>
			</F>
			<span>{palette()}</span>
		</>
	);
}
