// SPDX-FileCopyrightText: 2025-2026 caixw
//
// SPDX-License-Identifier: MIT

import { type MountProps, type Scheme, SchemeSelector, schemes } from '@cmfx/components';
import type { JSX } from 'solid-js';
import { Portal } from 'solid-js/web';

import { paletteSelector } from '@docs/components/base';

export default function (props: MountProps): JSX.Element {
	const [Palette, palette] = paletteSelector();
	const s = new Map<string, Scheme>([
		['Green', schemes.green],
		['Purple', schemes.purple],
	]);

	return (
		<>
			<Portal mount={props.mount}>
				<Palette />
			</Portal>

			<SchemeSelector.Root value="default" palette={palette()} schemes={s} />
		</>
	);
}
