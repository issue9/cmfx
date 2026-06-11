// SPDX-FileCopyrightText: 2024-2026 caixw
//
// SPDX-License-Identifier: MIT

import { Form, type MountProps, type Palette, RadioGroup } from '@cmfx/components';
import { createSignal, type JSX } from 'solid-js';
import { Portal } from 'solid-js/web';

import { boolSelector, layoutSelector } from '@docs/components/base';

export default function (props: MountProps): JSX.Element {
	const [palette, setPalette] = createSignal<Palette>('error');
	const [Rounded, rounded] = boolSelector('_d.demo.rounded');
	const [Disabled, disabled] = boolSelector('_d.demo.disabled');
	const [Readonly, readonly] = boolSelector('_d.demo.readonly');
	const [Layout, layout] = layoutSelector('_d.demo.componentLayout', 'horizontal');
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
				<Readonly />
				<Disabled />
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
						disabled={disabled()}
						readonly={readonly()}
					/>
				</Field>
			</F>
			<span>{palette()}</span>
		</>
	);
}
