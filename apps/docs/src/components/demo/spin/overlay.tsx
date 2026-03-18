// SPDX-FileCopyrightText: 2025-2026 caixw
//
// SPDX-License-Identifier: MIT

import { Button, type MountProps, Spin } from '@cmfx/components';
import type { JSX } from 'solid-js';
import { Portal } from 'solid-js/web';
import IconFace from '~icons/material-symbols/face';

import { boolSelector, paletteSelector } from '@docs/components/base';

export default function (props: MountProps): JSX.Element {
	const [Spinning, spinning] = boolSelector('spinning', false);
	const [Palette, palette] = paletteSelector('primary');

	return (
		<div>
			<Portal mount={props.mount}>
				<Palette />
				<Spinning />
			</Portal>

			<Spin.Root
				palette={palette()}
				indicator={<IconFace />}
				spinning={spinning()}
				class="flex gap-2 border border-palette-border p-2"
				overlayClass="bg-palette-bg/50 text-2xl"
			>
				<Button.Root>btn1</Button.Root>
				<p>overlay</p>
				<Button.Root>btn2</Button.Root>
			</Spin.Root>
		</div>
	);
}
