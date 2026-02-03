// SPDX-FileCopyrightText: 2024-2026 caixw
//
// SPDX-License-Identifier: MIT

import { BackTop, MountProps } from '@cmfx/components';
import { For, JSX } from 'solid-js';
import { Portal } from 'solid-js/web';

import { paletteSelector } from '@docs/components/base';

export default function (props: MountProps): JSX.Element {
	const [Palette, palette] = paletteSelector();

	const len: Array<number> = [];
	for (let i = 0; i < 100; i++) {
		len.push(i);
	}

	return (
		<>
			<Portal mount={props.mount}>
				<Palette />
			</Portal>

			<div class="overflow-y-scroll w-1/3 h-[200px] border border-palette-fg mt-10">
				<For each={len}>
					{i => (
						<>
							{i} <br />
						</>
					)}
				</For>
				<BackTop palette={palette()} class="mb-10 start-[300px] bottom-4! end-[unset]" />
			</div>
		</>
	);
}
