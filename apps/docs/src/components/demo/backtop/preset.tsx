// SPDX-FileCopyrightText: 2024-2026 caixw
//
// SPDX-License-Identifier: MIT

import type { MountProps } from '@cmfx/cdk';
import { BackTop } from '@cmfx/components';
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

			<div class="mt-10 h-50 w-1/3 overflow-y-scroll border border-palette-border">
				<For each={len}>
					{i => (
						<>
							{i} <br />
						</>
					)}
				</For>
				<BackTop palette={palette()} class="inset-e-[unset] inset-s-75 bottom-4! mb-10" />
			</div>
		</>
	);
}
