// SPDX-FileCopyrightText: 2024-2026 caixw
//
// SPDX-License-Identifier: MIT

import { Button, Dialog } from '@cmfx/components';
import type { JSX } from 'solid-js';

export default function (): JSX.Element {
	return (
		<div>
			<Button.Root
				onclick={async () => {
					await Dialog.alert('msg');
					console.log('alert');
				}}
			>
				alert
			</Button.Root>

			<Button.Root
				onclick={async () => {
					console.log(
						'confirm:',
						await Dialog.confirm(
							'这是一段非常非常长的文字内容！这是一段非常非常长的文字内容！这是一段非常非常长的文字内容！这是一段非常非常长的文字内容！',
						),
					);
				}}
			>
				confirm
			</Button.Root>

			<Button.Root
				onclick={async () => {
					console.log('prompt:', await Dialog.prompt('msg', 'def'));
				}}
			>
				prompt
			</Button.Root>

			<Button.Root
				onclick={() => {
					window.alert('msg');
					console.log('alert');
				}}
			>
				system.alert
			</Button.Root>
			<Button.Root
				onclick={() => {
					console.log(
						'confirm:',
						window.confirm(
							'这是一段非常非常长的文字内容！这是一段非常非常长的文字内容！这是一段非常非常长的文字内容！这是一段非常非常长的文字内容！',
						),
					);
				}}
			>
				system.confirm
			</Button.Root>
			<Button.Root
				onclick={() => {
					console.log('prompt:', window.prompt('msg', 'def'));
				}}
			>
				system.prompt
			</Button.Root>
		</div>
	);
}
