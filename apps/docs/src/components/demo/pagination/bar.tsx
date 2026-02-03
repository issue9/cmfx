// SPDX-FileCopyrightText: 2024-2026 caixw
//
// SPDX-License-Identifier: MIT

import { fieldAccessor, MountProps, Number, PaginationBar } from '@cmfx/components';
import { JSX } from 'solid-js';
import { Portal } from 'solid-js/web';

import { paletteSelector } from '@docs/components/base';

export default function (props: MountProps): JSX.Element {
	const [Palette, palette] = paletteSelector();
	const span = fieldAccessor('spans', 3);

	return (
		<div>
			<Portal mount={props.mount}>
				<Palette />
				<Number class="w-20" accessor={span} />
			</Portal>

			<PaginationBar spans={span.getValue()} palette={palette()} total={100} page={2} size={20} />
		</div>
	);
}
