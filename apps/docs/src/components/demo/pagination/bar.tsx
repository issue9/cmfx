// SPDX-FileCopyrightText: 2024-2026 caixw
//
// SPDX-License-Identifier: MIT

import { type MountProps, PaginationBar } from '@cmfx/components';
import type { JSX } from 'solid-js';
import { Portal } from 'solid-js/web';

import { numeric, paletteSelector } from '@docs/components/base';

export default function (props: MountProps): JSX.Element {
	const [Palette, palette] = paletteSelector();
	const [Num, num] = numeric('span', 3);

	return (
		<>
			<Portal mount={props.mount}>
				<Palette />
				<Num />
			</Portal>

			<PaginationBar spans={num()} palette={palette()} total={100} page={2} size={20} />
		</>
	);
}
