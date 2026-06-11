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
	let ref: Counter.Ref;

	return (
		<div>
			<Portal mount={props.mount}>
				<Palette />
				<Num />
			</Portal>

			<Counter ref={el => (ref = el)} palette={palette()} value={500} frequency={num()} />
			<Button onclick={() => ref.play()}>play</Button>
		</div>
	);
}
