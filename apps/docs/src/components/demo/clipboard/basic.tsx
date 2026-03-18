// SPDX-FileCopyrightText: 2026 caixw
//
// SPDX-License-Identifier: MIT

import { Button, Clipboard, Input } from '@cmfx/components';
import type { JSX } from 'solid-js';

export default function (): JSX.Element {
	let txtRef1: Input.RootRef;
	let txtRef2: Input.RootRef;
	let c1: Clipboard.RootRef;
	let c2: Clipboard.RootRef;

	return <div class="flex flex-col items-center gap-2">
		<Input.Root ref={el => txtRef1 = el} type='text' value='abc1' onChange={() => { }} suffix={
			<Button.Root square class="self-center mr-1" onclick={() => { c1.writeText(txtRef1.input().value) }}>
				<Clipboard.Root class="self-center mr-1" ref={el => c1 = el} />
			</Button.Root>
		} />


		<div class="flex items-center gap-2">
			<Input.Root ref={el => txtRef2 = el} type='text' value='abc2' onChange={() => { }} />
			<Button.Root square class="self-center mr-1" onclick={() => { c2.writeText(txtRef2.input().value) }}>
				<Clipboard.Root class="self-center mr-1" ref={el => c2 = el} />
			</Button.Root>
		</div>
	</div>;
}
