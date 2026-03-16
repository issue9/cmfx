// SPDX-FileCopyrightText: 2026 caixw
//
// SPDX-License-Identifier: MIT

import { CopyIcon, Input } from '@cmfx/components';
import type { JSX } from 'solid-js';

export default function (): JSX.Element {
	let txtRef1: Input.RootRef;
	let txtRef2: Input.RootRef;

	return <div class="flex flex-col items-center gap-2">
		<Input.Root ref={el => txtRef1 = el} type='text' value='abc1' onChange={() => { }} suffix={
			<CopyIcon.Root class="self-center mr-1" getText={() => txtRef1.input().value} />
		} />


		<div class="flex items-center gap-2">
			<Input.Root ref={el => txtRef2 = el} type='text' value='abc2' onChange={() => { }} />
			<CopyIcon.Root class="self-center mr-1" getText={() => txtRef2.input().value} />
		</div>
	</div>;
}
