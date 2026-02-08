// SPDX-FileCopyrightText: 2024-2026 caixw
//
// SPDX-License-Identifier: MIT

import { Button, Choice, ChoiceOption, fieldAccessor, MountProps, TextField } from '@cmfx/components';
import { JSX } from 'solid-js';
import { Portal } from 'solid-js/web';

import { boolSelector, layoutSelector, paletteSelector } from '@docs/components/base';

export default function (props: MountProps): JSX.Element {
	const mfa = fieldAccessor<Array<number>>('choice', [1, 2]);
	const multipleOptions: Array<ChoiceOption<number>> = [
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

	const tf = fieldAccessor('textfield', '');

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

				<Button
					palette="primary"
					onclick={() => {
						mfa.setError(mfa.getError() ? undefined : 'error');
					}}
				>
					toggle error
				</Button>
			</Portal>

			<div class="flex flex-row gap-5">
				<Choice
					layout={layout()}
					placeholder="placeholder"
					disabled={disabled()}
					rounded={rounded()}
					readonly={readonly()}
					palette={palette()}
					accessor={mfa}
					multiple
					options={multipleOptions}
					closable={closable()}
				/>
				<TextField
					layout={layout()}
					placeholder="placeholder"
					disabled={disabled()}
					rounded={rounded()}
					readonly={readonly()}
					palette={palette()}
					accessor={tf}
				/>
			</div>
		</div>
	);
}
