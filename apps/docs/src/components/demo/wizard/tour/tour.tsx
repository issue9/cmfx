// SPDX-FileCopyrightText: 2025-2026 caixw
//
// SPDX-License-Identifier: MIT

import { Button, Tour, TourRef } from '@cmfx/components';
import { JSX } from 'solid-js';
import IconPersion from '~icons/material-symbols/person';

export default function (): JSX.Element {
	let ref: TourRef;
	return (
		<div>
			<Tour
				ref={el => {
					ref = el;
				}}
				accentPalette="primary"
				steps={[
					{ title: 'Step 1', content: 'Content for Step 1', icon: <IconPersion />, id: 'b1', pos: 'right' },
					{ title: 'Step 2222222', content: 'Content for Step 2', id: 'b2', pos: 'right' },
					{ title: 'Step 3', content: 'Content for Step 3', id: 'b3', pos: 'left' },
				]}
			></Tour>
			<Button
				ref={el => {
					el.root().id = 'b1';
				}}
				onclick={() => ref.start()}
			>
				start
			</Button>
			<Button
				ref={el => {
					el.root().id = 'b2';
				}}
			>
				2222
			</Button>
			<Button
				ref={el => {
					el.root().id = 'b3';
				}}
			>
				3333
			</Button>
			<Button
				ref={el => {
					el.root().id = 'b4';
				}}
				class="ms-[200px]"
			>
				4444
			</Button>
		</div>
	);
}
