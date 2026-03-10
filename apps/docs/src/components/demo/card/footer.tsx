// SPDX-FileCopyrightText: 2024-2026 caixw
//
// SPDX-License-Identifier: MIT

import { Button, Card, MountProps } from '@cmfx/components';
import { JSX } from 'solid-js';
import { Portal } from 'solid-js/web';

import { paletteSelector } from '@docs/components/base';

export default function (props: MountProps): JSX.Element {
	const [Palette, palette] = paletteSelector();

	return (
		<div>
			<Portal mount={props.mount}>
				<Palette />
			</Portal>

			<Card.Root
				palette={palette()}
				footer={
					<>
						<Button.Root>OK</Button.Root> <Button.Root>Cancel</Button.Root>
					</>
				}
			>
				<p>不带标题，但是有页脚。</p>
				<Button.Root palette="primary">button</Button.Root>
			</Card.Root>
		</div>
	);
}
