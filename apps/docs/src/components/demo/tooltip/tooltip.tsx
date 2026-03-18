// SPDX-FileCopyrightText: 2025-2026 caixw
//
// SPDX-License-Identifier: MIT

import { Button, type MountProps, Tooltip } from '@cmfx/components';
import type { PopoverPosition } from '@cmfx/core';
import { createSignal, type JSX } from 'solid-js';
import { Portal } from 'solid-js/web';

import { posSelector } from '@docs/components/base';

export default function (props: MountProps): JSX.Element {
	let ref1: Tooltip.RootRef;
	let btn1: Button.RootRef;
	const [timeout, setTimeout] = createSignal<number>();
	const [Pos, pos] = posSelector();

	return (
		<>
			<Portal mount={props.mount}>
				<Pos />
				<input type="number" min={-1} max={5000} step={100} onChange={e => setTimeout(parseInt(e.target.value, 10))} />
			</Portal>

			<Button.Root
				palette="primary"
				ref={el => {
					btn1 = el;
				}}
				onclick={() => ref1.show(btn1.root(), pos() as PopoverPosition)}
			>
				show
			</Button.Root>
			<Tooltip.Root
				ref={el => {
					ref1 = el;
				}}
				stays={timeout()}
			>
				<p>tooltip</p>
				<p>
					line1
					<br />
					line2
				</p>
			</Tooltip.Root>
		</>
	);
}
