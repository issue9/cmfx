// SPDX-FileCopyrightText: 2025-2026 caixw
//
// SPDX-License-Identifier: MIT

import { Input, MountProps } from '@cmfx/components';
import { createSignal, JSX } from 'solid-js';
import { Portal } from 'solid-js/web';

import { boolSelector, paletteSelector } from '@docs/components/base';

export default function (props: MountProps): JSX.Element {
	const [Disabled, disabled] = boolSelector('_d.demo.disabled');
	const [Readonly, readonly] = boolSelector('_d.demo.readonly');
	const [Rounded, rounded] = boolSelector('_d.demo.rounded');
	const [Palette, palette] = paletteSelector();

	const prefix = <div class="flex items-center bg-red-500">prefix</div>;
	const suffix = <div class="flex items-center bg-red-500">suffix</div>;

	const [val, setVal] = createSignal('');

	return (
		<>
			<Portal mount={props.mount}>
				<Palette />
				<Readonly />
				<Rounded />
				<Disabled />
			</Portal>

			<div class="flex w-80 flex-col gap-2">
				<Input
					placeholder="placeholder"
					palette={palette()}
					value={val()}
					onChange={v => setVal(v as string)}
					disabled={disabled()}
					rounded={rounded()}
					readonly={readonly()}
				/>

				<Input
					placeholder="placeholder"
					palette={palette()}
					prefix={prefix}
					suffix={suffix}
					disabled={disabled()}
					rounded={rounded()}
					readonly={readonly()}
					value={val()}
					onChange={v => {
						setVal(v as string);
					}}
				/>

				<p>{val()}</p>
			</div>
		</>
	);
}
