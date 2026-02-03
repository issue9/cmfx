// SPDX-FileCopyrightText: 2024-2026 caixw
//
// SPDX-License-Identifier: MIT

import { Badge, Button, badgeCorners, MountProps } from '@cmfx/components';
import { For } from 'solid-js';
import { Portal } from 'solid-js/web';

import { boolSelector, paletteSelector } from '@docs/components/base';

export default function (props: MountProps) {
	const [Palette, palette] = paletteSelector();
	const [Rounded, rounded] = boolSelector('_d.demo.rounded', true);

	return (
		<div>
			<Portal mount={props.mount}>
				<Palette />
				<Rounded />
			</Portal>

			<div class="flex flex-wrap gap-3 justify-start">
				<For each={badgeCorners}>
					{pos => (
						<Badge rounded={rounded()} pos={pos} palette={palette()} content="99+">
							<Button palette="primary">{pos}</Button>
						</Badge>
					)}
				</For>
			</div>
		</div>
	);
}
