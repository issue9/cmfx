// SPDX-FileCopyrightText: 2025-2026 caixw
//
// SPDX-License-Identifier: MIT

import { MountProps, Settings } from '@cmfx/components';
import { JSX } from 'solid-js';
import { Portal } from 'solid-js/web';

import { paletteSelector } from '@docs/components/base';

export default function (props: MountProps): JSX.Element {
	const [Palette, palette] = paletteSelector();
	return (
		<div class="w-full">
			<Portal mount={props.mount}>
				<Palette />
			</Portal>

			<Settings palette={palette()} />
		</div>
	);
}
