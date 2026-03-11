// SPDX-FileCopyrightText: 2024-2026 caixw
//
// SPDX-License-Identifier: MIT

import { Button, Card, Label, MountProps } from '@cmfx/components';
import { JSX } from 'solid-js';
import { Portal } from 'solid-js/web';
import IconEye from '~icons/material-symbols/eyeglasses';

import { paletteSelector } from '@docs/components/base';

export default function (props: MountProps): JSX.Element {
	const [Palette, palette] = paletteSelector();

	return (
		<div>
			<Portal mount={props.mount}>
				<Palette />
			</Portal>

			<Card.Root palette={palette()} header={<Label.Root icon={<IconEye />}>title</Label.Root>}>
				<p>这是一行文字</p>
				<Button.Root palette="primary">button</Button.Root>
			</Card.Root>
		</div>
	);
}
