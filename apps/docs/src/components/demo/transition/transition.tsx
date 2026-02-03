// SPDX-FileCopyrightText: 2025-2026 caixw
//
// SPDX-License-Identifier: MIT

import { Button, Transition } from '@cmfx/components';
import { createSignal, Show } from 'solid-js';

export default function () {
	const [curr, setCurr] = createSignal<'red' | 'blue'>('red');

	return (
		<div class="flex flex-col gap-2">
			<Button
				onclick={() => {
					setCurr(curr() === 'red' ? 'blue' : 'red');
				}}
			>
				switch
			</Button>

			<div>
				<Transition>
					<Show when={curr() === 'red'}>
						<div class="w-40 h-40 bg-red-500" />
					</Show>
					<Show when={curr() === 'blue'}>
						<div class="w-40 h-40 bg-blue-500" />
					</Show>
				</Transition>
			</div>
		</div>
	);
}
