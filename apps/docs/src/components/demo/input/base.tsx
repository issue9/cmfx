// SPDX-FileCopyrightText: 2025-2026 caixw
//
// SPDX-License-Identifier: MIT

import type { MountProps } from '@cmfx/cdk';
import { InputBase } from '@cmfx/components';
import { createSignal, type JSX } from 'solid-js';
import { Portal } from 'solid-js/web';

import { boolSelector, paletteSelector, stateSelector } from '@docs/components/base';

export default function (props: MountProps): JSX.Element {
	const [Rounded, rounded] = boolSelector('_d.demo.rounded');
	const [Palette, palette] = paletteSelector();
	const [State, state] = stateSelector();

	const prefix = <div class="flex items-center bg-red-500">prefix</div>;
	const suffix = <div class="flex items-center bg-red-500">suffix</div>;

	const [val, setVal] = createSignal('');

	return (
		<>
			<Portal mount={props.mount}>
				<Palette />
				<Rounded />
				<State />
			</Portal>

			<div class="flex w-80 flex-col gap-2">
				<InputBase
					placeholder="placeholder"
					palette={palette()}
					value={val()}
					onChange={v => setVal(v as string)}
					rounded={rounded()}
					state={state()}
				/>

				<InputBase
					placeholder="placeholder"
					palette={palette()}
					prefix={prefix}
					suffix={suffix}
					state={state()}
					rounded={rounded()}
					value={val()}
					onChange={v => setVal(v as string)}
				/>

				<p>{val()}</p>
			</div>
		</>
	);
}
