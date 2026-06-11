// SPDX-FileCopyrightText: 2024-2026 caixw
//
// SPDX-License-Identifier: MIT

import { Button, Card, type MountProps } from '@cmfx/components';
import type { JSX } from 'solid-js';
import { Portal } from 'solid-js/web';

import { paletteSelector } from '@docs/components/base';

export default function (props: MountProps): JSX.Element {
	const [Palette, palette] = paletteSelector();

	return (
		<div>
			<Portal mount={props.mount}>
				<Palette />
			</Portal>

			<Card
				palette={palette()}
				footer={
					<>
						<Button>OK</Button> <Button>Cancel</Button>
					</>
				}
			>
				<p>不带标题，但是有页脚。</p>
				<Button palette="primary">button</Button>
			</Card>
		</div>
	);
}
