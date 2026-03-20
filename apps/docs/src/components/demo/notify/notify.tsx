// SPDX-FileCopyrightText: 2024-2026 caixw
//
// SPDX-License-Identifier: MIT

import { Alert, Button, Choice, fieldAccessor, Notify, Numeric, TextArea, TextField } from '@cmfx/components';
import { sleep } from '@cmfx/core';
import type { JSX } from 'solid-js';

export default function (): JSX.Element {
	const typ = fieldAccessor<Alert.Type>('type', 'success');
	const timeout = fieldAccessor<number>('timeout', 5000);
	const title = fieldAccessor<string>('title', 'title');
	const body = fieldAccessor<string>('body', 'body');

	const click = async (): Promise<void> => {
		await Notify.notify(title.getValue(), body.getValue(), typ.getValue(), timeout.getValue());
	};

	return (
		<>
			<div class="flex w-40 flex-col gap-2">
				<Choice.Root
					label="type"
					accessor={typ}
					options={Alert.types.map(v => {
						return { type: 'item', value: v, label: v };
					})}
				/>
				<Numeric.Root step={500} label="timeout" accessor={timeout} />
				<TextField.Root label="title" accessor={title} />
				<TextArea.Root label="body" accessor={body} />
				<Button.Root palette="primary" onclick={click}>
					notify
				</Button.Root>
			</div>

			<div>
				切换到其它标签页，5 秒后会得到系统通知，否则当前页面弹出。
				<Button.Root
					palette="primary"
					onclick={async () => {
						await sleep(5000);
						Notify.error('error', '由浏览器转换而来,5 秒后自动关闭', 5000, true);
					}}
				>
					Notify.error(...system)
				</Button.Root>
			</div>
		</>
	);
}
