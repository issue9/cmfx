// SPDX-FileCopyrightText: 2025-2026 caixw
//
// SPDX-License-Identifier: MIT

import type { MountProps } from '@cmfx/components';
import { BUG, galleries } from '@cmfx/illustrations';
import type { JSX } from 'solid-js';
import { Portal } from 'solid-js/web';

import { arraySelector, paletteSelector } from '@docs/components/base';

export default function (props: MountProps): JSX.Element {
	const [Palette, palette] = paletteSelector();
	const [Gallery, gallery] = arraySelector('选择集', galleries, 'amico');

	return (
		<>
			<Portal mount={props.mount}>
				<Palette />
				<Gallery />
			</Portal>

			<BUG gallery={gallery()} class="aspect-square w-full" palette={palette()} />
		</>
	);
}
