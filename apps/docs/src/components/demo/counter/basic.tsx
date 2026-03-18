// SPDX-FileCopyrightText: 2025-2026 caixw
//
// SPDX-License-Identifier: MIT

import { Button, Counter, fieldAccessor, type MountProps, Numeric } from '@cmfx/components';
import type { JSX } from 'solid-js';
import { Portal } from 'solid-js/web';

import { paletteSelector } from '@docs/components/base';

export default function (props: MountProps): JSX.Element {
	const [Palette, palette] = paletteSelector('primary');
	let ref: Counter.RootRef;
	const fa = fieldAccessor('freq', 20);

	return (
		<div>
			<Portal mount={props.mount}>
				<Palette />
				<Numeric.Root class="w-20" accessor={fa} />
			</Portal>

			<Counter.Root
				ref={el => {
					ref = el;
				}}
				palette={palette()}
				value={500}
				frequency={fa.getValue()}
			/>
			<Button.Root onclick={() => ref.play()}>play</Button.Root>
		</div>
	);
}
