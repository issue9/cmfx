// SPDX-FileCopyrightText: 2025-2026 caixw
//
// SPDX-License-Identifier: MIT

import { MountProps, Scheme, SchemeSelector, schemes } from '@cmfx/components';
import { JSX } from 'solid-js';
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

			<SchemeSelector value="default" palette={palette()} schemes={s} />
		</>
	);
}
