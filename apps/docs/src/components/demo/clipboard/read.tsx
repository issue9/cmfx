// SPDX-FileCopyrightText: 2026 caixw
//
// SPDX-License-Identifier: MIT

import type { MountProps } from '@cmfx/cdk';
import { Button, ClipboardReader, InputBase } from '@cmfx/components';
import { createSignal, type JSX } from 'solid-js';

export default function (_: MountProps): JSX.Element {
	let c1: ClipboardReader.Ref;
	let c2: ClipboardReader.Ref;
	const [v1, setV1] = createSignal('');
	const [v2, setV2] = createSignal('');

	return (
		<div class="flex flex-col items-center gap-2">
			<InputBase
				type="text"
				value={v1()}
				suffix={
					<Button square class="mr-1 self-center" onclick={async () => setV1(await c1.readText())}>
						<ClipboardReader class="self-center" ref={el => (c1 = el)} />
					</Button>
				}
			/>

			<div class="flex items-center gap-2">
				<InputBase type="text" value={v2()} />
				<Button square class="self-center" onclick={async () => setV2(await c2.readText())}>
					<ClipboardReader class="self-center" ref={el => (c2 = el)} />
				</Button>
			</div>
		</div>
	);
}
