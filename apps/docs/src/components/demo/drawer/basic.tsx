// SPDX-FileCopyrightText: 2025-2026 caixw
//
// SPDX-License-Identifier: MIT

import { Button, Drawer, DrawerRef, MountProps } from '@cmfx/components';
import { JSX } from 'solid-js';
import { Portal } from 'solid-js/web';

import { arraySelector, paletteSelector } from '@docs/components/base';

export default function (props: MountProps): JSX.Element {
	const [Palette, palette] = paletteSelector('secondary');
	const [Pos, pos] = arraySelector('pos', ['start', 'end'], 'start');
	let ref: DrawerRef;

	return (
		<>
			<Portal mount={props.mount}>
				<Palette />
				<Pos />
			</Portal>

			<Drawer
				ref={el => {
					ref = el;
				}}
				pos={pos()}
				palette={palette()}
				visible={true}
				floating
				main={
					<main class="h-full bg-primary-bg">
						abc
						<br />
						<br />
						<br />
						<br />
						<br />
						<br />
						hij
					</main>
				}
			>
				<div class="h-full min-w-20 border-palette-border">
					aside
					<br />
				</div>
			</Drawer>

			{ref!.ToggleButton({ square: true, class: 'grow-0' })}
			<Button
				onclick={() => {
					ref.toggle();
				}}
			>
				ref.toggle
			</Button>
		</>
	);
}
