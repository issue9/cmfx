// SPDX-FileCopyrightText: 2024-2026 caixw
//
// SPDX-License-Identifier: MIT

import { BackTop, type MountProps } from '@cmfx/components';
import { For, type JSX } from 'solid-js';
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

			<div class="mt-10 h-[200px] w-1/3 overflow-y-scroll border border-palette-fg">
				<For each={len}>
					{i => (
						<>
							{i} <br />
						</>
					)}
				</For>
				<BackTop.Root palette={palette()} class="inset-e-[unset] inset-s-[300px] bottom-4! mb-10" />
			</div>
		</>
	);
}
