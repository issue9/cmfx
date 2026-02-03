// SPDX-FileCopyrightText: 2024-2026 caixw
//
// SPDX-License-Identifier: MIT

import { Button, MountProps, Spin } from '@cmfx/components';
import { JSX } from 'solid-js';
import { Portal } from 'solid-js/web';

import { boolSelector, paletteSelector } from '@docs/components/base';

export default function (props: MountProps): JSX.Element {
	const [Spinning, spinning] = boolSelector('spinning', false);
	const [Palette, palette] = paletteSelector('primary');

	return (
		<>
			<Portal mount={props.mount}>
				<Palette />
				<Spinning />
			</Portal>

			<Spin palette={palette()} spinning={spinning()} class="border border-palette-bg-high flex gap-2 p-2">
				<Button>btn1</Button>
				<Button>btn2</Button>
			</Spin>
		</>
	);
}
