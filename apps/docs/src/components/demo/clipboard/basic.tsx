// SPDX-FileCopyrightText: 2026 caixw
//
// SPDX-License-Identifier: MIT

import { Button, ClipboardAPI, InputBase } from '@cmfx/components';
import type { JSX } from 'solid-js';

export default function (): JSX.Element {
	let txtRef1: InputBase.Ref;
	let txtRef2: InputBase.Ref;
	let c1: ClipboardAPI.Ref;
	let c2: ClipboardAPI.Ref;

	return (
		<div class="flex flex-col items-center gap-2">
			<InputBase
				ref={el => (txtRef1 = el)}
				type="text"
				value="abc1"
				onChange={() => {}}
				suffix={
					<Button
						square
						class="mr-1 self-center"
						onclick={() => {
							c1.writeText(txtRef1.input().value);
						}}
					>
						<ClipboardAPI class="mr-1 self-center" ref={el => (c1 = el)} />
					</Button>
				}
			/>

			<div class="flex items-center gap-2">
				<InputBase ref={el => (txtRef2 = el)} type="text" value="abc2" onChange={() => {}} />
				<Button
					square
					class="mr-1 self-center"
					onclick={() => {
						c2.writeText(txtRef2.input().value);
					}}
				>
					<ClipboardAPI class="mr-1 self-center" ref={el => (c2 = el)} />
				</Button>
			</div>
		</div>
	);
}
