// SPDX-FileCopyrightText: 2025-2026 caixw
//
// SPDX-License-Identifier: MIT

import { MountProps, Tab, TabItem } from '@cmfx/components';
import { JSX } from 'solid-js';
import { Portal } from 'solid-js/web';

import { paletteSelector } from '@docs/components/base';

export default function (props: MountProps): JSX.Element {
	const items: Array<TabItem> = [
		{ id: 'k1', label: 'K1' },
		{ id: 'k2', label: 'K22222' },
		{ id: 'k3', label: 'K3', disabled: true },
		{ id: 'k4', label: 'K4' },
	];

	const [Palette, palette] = paletteSelector();

	return (
		<>
			<Portal mount={props.mount}>
				<Palette />
			</Portal>

			<Tab class="w-full!" palette={palette()} items={items} />
		</>
	);
}
