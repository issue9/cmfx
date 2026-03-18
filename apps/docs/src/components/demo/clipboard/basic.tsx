// SPDX-FileCopyrightText: 2026 caixw
//
// SPDX-License-Identifier: MIT

import { Button, ClipboardAPI, Input } from '@cmfx/components';
import type { JSX } from 'solid-js';

export default function (): JSX.Element {
	let txtRef1: Input.RootRef;
	let txtRef2: Input.RootRef;
	let c1: ClipboardAPI.RootRef;
	let c2: ClipboardAPI.RootRef;

	return (
		<div class="flex flex-col items-center gap-2">
			<Input.Root
				ref={el => (txtRef1 = el)}
				type="text"
				value="abc1"
				onChange={() => {}}
				suffix={
					<Button.Root
						square
						class="mr-1 self-center"
						onclick={() => {
							c1.writeText(txtRef1.input().value);
						}}
					>
						<ClipboardAPI.Root class="mr-1 self-center" ref={el => (c1 = el)} />
					</Button.Root>
				}
			/>

			<div class="flex items-center gap-2">
				<Input.Root ref={el => (txtRef2 = el)} type="text" value="abc2" onChange={() => {}} />
				<Button.Root
					square
					class="mr-1 self-center"
					onclick={() => {
						c2.writeText(txtRef2.input().value);
					}}
				>
					<ClipboardAPI.Root class="mr-1 self-center" ref={el => (c2 = el)} />
				</Button.Root>
			</div>
		</div>
	);
}
