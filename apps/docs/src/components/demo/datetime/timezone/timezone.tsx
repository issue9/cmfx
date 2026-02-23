// SPDX-FileCopyrightText: 2025-2026 caixw
//
// SPDX-License-Identifier: MIT

import { MountProps, Timezone } from '@cmfx/components';
import { createSignal, JSX } from 'solid-js';
import { Portal } from 'solid-js/web';

import { paletteSelector } from '@docs/components/base';

export default function (props: MountProps): JSX.Element {
	const [Palette, palette] = paletteSelector('primary');
	const [timezone, setTimezone] = createSignal<string>('Asia/Shanghai');

	return (
		<div class="w-full">
			<Portal mount={props.mount}>
				<Palette />
			</Portal>

			<Timezone value={timezone()} palette={palette()} onChange={d => setTimezone(d)} />
			<span>{timezone()}</span>
		</div>
	);
}
