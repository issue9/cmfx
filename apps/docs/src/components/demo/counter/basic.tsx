// SPDX-FileCopyrightText: 2025-2026 caixw
//
// SPDX-License-Identifier: MIT

import { Button, Counter, type MountProps } from '@cmfx/components';
import type { JSX } from 'solid-js';
import { Portal } from 'solid-js/web';

import { numeric, paletteSelector } from '@docs/components/base';

export default function (props: MountProps): JSX.Element {
	const [Palette, palette] = paletteSelector('primary');
	const [Num, num] = numeric('freq', 20);
	let ref: Counter.RootRef;

	return (
		<div>
			<Portal mount={props.mount}>
				<Palette />
				<Num />
			</Portal>

			<Counter.Root ref={el => (ref = el)} palette={palette()} value={500} frequency={num()} />
			<Button.Root onclick={() => ref.play()}>play</Button.Root>
		</div>
	);
}
