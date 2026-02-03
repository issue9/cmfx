// SPDX-FileCopyrightText: 2024-2026 caixw
//
// SPDX-License-Identifier: MIT

import { Button, xalert, xconfirm, xprompt } from '@cmfx/components';
import { JSX } from 'solid-js';

export default function (): JSX.Element {
	return (
		<div>
			<Button
				onclick={async () => {
					await xalert('msg');
					console.log('alert');
				}}
			>
				alert
			</Button>

			<Button
				onclick={async () => {
					console.log(
						'confirm:',
						await xconfirm(
							'这是一段非常非常长的文字内容！这是一段非常非常长的文字内容！这是一段非常非常长的文字内容！这是一段非常非常长的文字内容！',
						),
					);
				}}
			>
				confirm
			</Button>

			<Button
				onclick={async () => {
					console.log('prompt:', await xprompt('msg', 'def'));
				}}
			>
				prompt
			</Button>

			<Button
				onclick={() => {
					window.alert('msg');
					console.log('alert');
				}}
			>
				system.alert
			</Button>
			<Button
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
			</Button>
			<Button
				onclick={() => {
					console.log('prompt:', window.prompt('msg', 'def'));
				}}
			>
				system.prompt
			</Button>
		</div>
	);
}
