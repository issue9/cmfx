// SPDX-FileCopyrightText: 2024-2026 caixw
//
// SPDX-License-Identifier: MIT

import { Alert, Button, Checkbox, Choice, InputNumber, InputText, Notify } from '@cmfx/components';
import { sleep } from '@cmfx/core';
import { createSignal, type JSX } from 'solid-js';

export default function (): JSX.Element {
	const [typ, setTyp] = createSignal<Alert.Type>('success');
	const [pos, setPos] = createSignal<Notify.Position>('top');
	const [timeout, setTimeout] = createSignal(5000);
	const [title, setTitle] = createSignal('title');
	const [accept, setAccept] = createSignal('accept');
	const [body, setBody] = createSignal('');
	const [bodyType, setBodyType] = createSignal<'empty' | 'line' | 'multiple'>('empty');

	const click = async (): Promise<void> => {
		await Notify.notify(title(), {
			body: body(),
			type: typ(),
			duration: timeout(),
			system: false,
			pos: pos(),
			accept: accept() ? (): Promise<boolean | undefined> => Promise.resolve(false) : undefined,
		});
	};

	return (
		<>
			<div class="flex w-40 flex-col gap-2">
				<Choice
					closable
					placeholder="type"
					value={typ()}
					onChange={setTyp}
					options={Alert.types.map(v => {
						return { type: 'item', value: v, label: v };
					})}
				/>

				<Choice
					placeholder="position"
					value={pos()}
					onChange={setPos}
					closable
					options={Notify.positions.map(v => {
						return { type: 'item', value: v, label: v };
					})}
				/>
				<Choice
					placeholder="body"
					value={bodyType()}
					onChange={v => {
						setBodyType(v!);
						switch (v) {
							case 'empty':
								setBody('');
								break;
							case 'line':
								setBody('line');
								break;
							case 'multiple':
								setBody('body\nwith\nnewline');
								break;
						}
					}}
					options={[
						{ type: 'item', value: 'empty', label: 'empty' },
						{ type: 'item', value: 'line', label: 'line' },
						{ type: 'item', value: 'multiple', label: 'multiple' },
					]}
				/>
				<InputNumber step={500} placeholder="timeout" value={timeout()} onChange={setTimeout} />
				<InputText placeholder="title" value={title()} onChange={setTitle} />
				<InputText placeholder="body" value={body()} onChange={setBody} />
				<Checkbox label="accept" onChange={setAccept} />
				<Button palette="primary" onclick={click}>
					notify
				</Button>
			</div>

			<div>
				切换到其它标签页，5 秒后会得到系统通知，否则当前页面弹出。
				<Button
					palette="primary"
					onclick={async () => {
						await sleep(5000);
						await Notify.error('error', { body: '由浏览器转换而来,5 秒后自动关闭', duration: 5000 });
					}}
				>
					Notify.error(...system)
				</Button>
			</div>
		</>
	);
}
