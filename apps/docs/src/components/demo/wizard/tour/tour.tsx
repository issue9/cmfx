// SPDX-FileCopyrightText: 2025-2026 caixw
//
// SPDX-License-Identifier: MIT

import { Button, Tour } from '@cmfx/components';
import type { JSX } from 'solid-js';
import IconPerson from '~icons/material-symbols/person';

export default function (): JSX.Element {
	let ref: Tour.RootRef;
	return (
		<div>
			<Tour.Root
				ref={el => {
					ref = el;
				}}
				accentPalette="primary"
				steps={[
					{ title: 'Step 1', content: 'Content for Step 1', icon: <IconPerson />, id: 'b1', pos: 'right' },
					{ title: 'Step 2222222', content: 'Content for Step 2', id: 'b2', pos: 'right' },
					{ title: 'Step 3', content: 'Content for Step 3', id: 'b3', pos: 'left' },
				]}
			></Tour.Root>
			<Button.Root
				ref={el => {
					el.root().id = 'b1';
				}}
				onclick={() => ref.start()}
			>
				start
			</Button.Root>
			<Button.Root
				ref={el => {
					el.root().id = 'b2';
				}}
			>
				2222
			</Button.Root>
			<Button.Root
				ref={el => {
					el.root().id = 'b3';
				}}
			>
				3333
			</Button.Root>
			<Button.Root
				ref={el => {
					el.root().id = 'b4';
				}}
				class="ms-[200px]"
			>
				4444
			</Button.Root>
		</div>
	);
}
