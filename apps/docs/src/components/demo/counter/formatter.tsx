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
			<Counter
				start={999}
				ref={el => (ref = el)}
				palette={palette()}
				value={500}
				formatter={(v: number) => `${v.toFixed(2)}%`}
				frequency={num()}
			/>
			<Button onclick={() => ref.play()}>play</Button>
		</div>
	);
}
