// SPDX-FileCopyrightText: 2024-2026 caixw
//
// SPDX-License-Identifier: MIT

import { Badge, Button, type MountProps } from '@cmfx/components';
import { For } from 'solid-js';
import { Portal } from 'solid-js/web';

import { paletteSelector } from '@docs/components/base';

export default function (props: MountProps) {
	const [Palette, palette] = paletteSelector();

	return (
		<div>
			<Portal mount={props.mount}>
				<Palette />
			</Portal>

			<div class="flex flex-wrap justify-start gap-3">
				<For each={Badge.corners}>
					{pos => (
						<Badge.Root pos={pos} palette={palette()} content="这是一段很长的文字内容">
							<Button.Root palette="primary">{pos}</Button.Root>
						</Badge.Root>
					)}
				</For>
			</div>
		</div>
	);
}
