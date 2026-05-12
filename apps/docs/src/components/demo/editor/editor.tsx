// SPDX-FileCopyrightText: 2024-2026 caixw
//
// SPDX-License-Identifier: MIT

import { Editor, type MountProps } from '@cmfx/components';
import { createSignal, type JSX } from 'solid-js';
import { Portal } from 'solid-js/web';

import { boolSelector, paletteSelector } from '@docs/components/base';

export default function (props: MountProps): JSX.Element {
	const [txt, setTxt] = createSignal('');
	const [Disabled, disabled] = boolSelector('_d.demo.disabled');
	const [Readonly, readonly] = boolSelector('_d.demo.readonly');
	const [Palette, palette] = paletteSelector();

	return (
		<>
			<Portal mount={props.mount}>
				<Palette />
				<Disabled />
				<Readonly />
			</Portal>

			<Editor.Root
				class="h-[500px] w-full"
				palette={palette()}
				readonly={readonly()}
				disabled={disabled()}
				value={txt()}
				onChange={v => setTxt(v)}
				placeholder="placeholder text"
			/>
			<pre>{txt()}</pre>
		</>
	);
}
