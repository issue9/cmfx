// SPDX-FileCopyrightText: 2025-2026 caixw
//
// SPDX-License-Identifier: MIT

import { type MountProps, Tab } from '@cmfx/components';
import type { JSX } from 'solid-js';
import { Portal } from 'solid-js/web';

import { paletteSelector } from '@docs/components/base';

export default function (props: MountProps): JSX.Element {
	const items: Array<Tab.Item> = [
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

			<Tab.Root class="w-full!" palette={palette()} items={items} />
		</>
	);
}
