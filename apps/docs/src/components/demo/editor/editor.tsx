// SPDX-FileCopyrightText: 2024-2026 caixw
//
// SPDX-License-Identifier: MIT

import type { MountProps } from '@cmfx/cdk';
import { Editor } from '@cmfx/components';
import { createSignal, type JSX } from 'solid-js';
import { Portal } from 'solid-js/web';

import { paletteSelector, stateSelector } from '@docs/components/base';

export default function (props: MountProps): JSX.Element {
	const [txt, setTxt] = createSignal<string>();
	const [Palette, palette] = paletteSelector();
	const [State, state] = stateSelector();

	return (
		<>
			<Portal mount={props.mount}>
				<Palette />
				<State />
			</Portal>

			<Editor
				class="h-125 w-full"
				palette={palette()}
				state={state()}
				value={txt()}
				onChange={v => setTxt(v)}
				placeholder="placeholder text"
			/>
			<pre>{txt()}</pre>
		</>
	);
}
