// SPDX-FileCopyrightText: 2024-2026 caixw
//
// SPDX-License-Identifier: MIT

import { Choice, Form1, type MountProps,  InputText } from '@cmfx/components';
import { createSignal, type JSX } from 'solid-js';
import { Portal } from 'solid-js/web';

import { boolSelector, paletteSelector } from '@docs/components/base';

export default function (props: MountProps): JSX.Element {
	const [val, setVal] = createSignal('1');
	const options: Array<Choice.Option> = [
		{ type: 'item', value: '1', label: <div>abc</div> },
		{ type: 'item', value: '2', label: <div style="color:green">green</div> },
		{
			type: 'item',
			value: '3',
			label: (
				<div style="color:red">
					red
					<br />
					red
				</div>
			),
		},
	];

	const tf = Form1.fieldAccessor('textfield', '');

	const [Palette, palette] = paletteSelector();
	const [Closable, closable] = boolSelector('closable');
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
			</Portal>

			<div class="flex items-start justify-start gap-5">
				<Choice.Root
					closable={closable()}
					tabindex={0}
					placeholder="placeholder"
					disabled={disabled()}
					rounded={rounded()}
					readonly={readonly()}
					palette={palette()}
					value={val()}
					onChange={v => setVal(v)}
					options={options}
				/>
				<InputText.Root
					placeholder="placeholder"
					disabled={disabled()}
					rounded={rounded()}
					readonly={readonly()}
					palette={palette()}
					accessor={tf}
				/>
				<p>{val()}</p>
			</div>
		</div>
	);
}
