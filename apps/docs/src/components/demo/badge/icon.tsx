// SPDX-FileCopyrightText: 2025-2026 caixw
//
// SPDX-License-Identifier: MIT

import type { MountProps } from '@cmfx/cdk';
import { Badge, Button } from '@cmfx/components';
import { For } from 'solid-js';
import { Portal } from 'solid-js/web';
import IconFace from '~icons/material-symbols/face';

import { boolSelector, paletteSelector } from '@docs/components/base';

export default function (props: MountProps) {
	const [Palette, palette] = paletteSelector();
	const [Rounded, rounded] = boolSelector('_d.demo.rounded', true);
	const [Visible, visible] = boolSelector('_d.demo.visible', true);

	return (
		<div>
			<Portal mount={props.mount}>
				<Palette />
				<Rounded />
				<Visible />
			</Portal>

			<div class="flex flex-wrap justify-start gap-3">
				<For each={Badge.corners}>
					{pos => (
						<Badge visible={visible()} pos={pos} rounded={rounded()} palette={palette()} content={<IconFace />}>
							<Button palette="primary">{pos}</Button>
						</Badge>
					)}
				</For>
			</div>
		</div>
	);
}
