// SPDX-FileCopyrightText: 2024-2026 caixw
//
// SPDX-License-Identifier: MIT

import { Choice, Form, type MountProps } from '@cmfx/components';
import { createSignal, type JSX } from 'solid-js';
import { Portal } from 'solid-js/web';

import { boolSelector, layoutSelector, paletteSelector } from '@docs/components/base';

export default function (props: MountProps): JSX.Element {
	const [val, setVal] = createSignal([1]);
	const [F, Field] = Form.create({ initValue: { a: [1, 2] } });

	const multipleOptions: Choice.Options<number> = [
		{ type: 'item', value: 1, label: <div>abc</div> },
		{ type: 'item', value: 2, label: <div style="color:green">green</div> },
		{ type: 'divider' },
		{
			type: 'group',
			label: 'Group',
			items: [
				{
					type: 'item',
					value: 3,
					label: (
						<div style="color:red">
							red
							<br />
							red
						</div>
					),
				},
				{ type: 'item', value: 4, label: <div style="color:yellow">yellow</div> },
				{ type: 'item', value: 5, label: <div style="color:blue">blue</div> },
				{ type: 'item', value: 6, label: <div style="color:red">red2</div> },
				{ type: 'item', value: 7, label: <div style="color:red">red3</div> },
				{
					type: 'item',
					value: 8,
					label: <div style="color:red">red4</div>,
					items: [
						{ type: 'item', value: 81, label: <div style="color:red">red41</div> },
						{ type: 'item', value: 82, label: <div style="color:red">red42</div> },
						{ type: 'item', value: 83, label: <div style="color:red">red43</div> },
					],
				},
				{ type: 'item', value: 9, label: <div style="color:red">red5</div> },
			],
		},
	];

	const [Palette, palette] = paletteSelector();
	const [Closable, closable] = boolSelector('closable');
	const [Layout, layout] = layoutSelector('_d.demo.componentLayout', 'horizontal');
	const [Disabled, disabled] = boolSelector('_d.demo.disabled');
	const [Readonly, readonly] = boolSelector('_d.demo.readonly');
	const [Rounded, rounded] = boolSelector('_d.demo.rounded');

	return (
		<div>
			<Portal mount={props.mount}>
				<Palette />
				<Disabled />
				<Readonly />
				<Closable />
				<Rounded />
				<Layout />
			</Portal>

			<F>
				<div class="flex flex-row gap-5">
					<Field label="label" name="a" layout={layout()}>
						<Choice
							placeholder="placeholder"
							disabled={disabled()}
							rounded={rounded()}
							readonly={readonly()}
							palette={palette()}
							value={val()}
							multiple
							options={multipleOptions}
							closable={closable()}
							onChange={v => setVal(v)}
						/>
					</Field>

					<p>{val().join(',')}</p>
				</div>
			</F>
		</div>
	);
}
