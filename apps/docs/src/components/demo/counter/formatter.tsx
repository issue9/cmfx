// SPDX-FileCopyrightText: 2025-2026 caixw
//
// SPDX-License-Identifier: MIT

import { Button, Counter, CounterRef, fieldAccessor, MountProps, Number } from '@cmfx/components';
import { JSX } from 'solid-js';
import { Portal } from 'solid-js/web';

import { paletteSelector } from '@docs/components/base';

export default function (props: MountProps): JSX.Element {
	const [Palette, palette] = paletteSelector('primary');
	let ref: CounterRef;
	const fa = fieldAccessor('freq', 20);

	return (
		<div>
			<Portal mount={props.mount}>
				<Palette />
				<Number class="w-20" accessor={fa} />
			</Portal>
			<Counter
				start={999}
				ref={el => {
					ref = el;
				}}
				palette={palette()}
				value={500}
				formatter={(v: number) => `${v.toFixed(2)}%`}
				frequency={fa.getValue()}
			/>
			<Button onclick={() => ref.play()}>play</Button>
		</div>
	);
}
