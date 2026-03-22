// SPDX-FileCopyrightText: 2024-2026 caixw
//
// SPDX-License-Identifier: MIT

import type { MountProps } from '@cmfx/components';
import { Button, DatePicker, Form, Notify, Numeric, TextArea, TextField } from '@cmfx/components';
import type { JSX } from 'solid-js';
import { Portal } from 'solid-js/web';

import { boolSelector, layoutSelector, paletteSelector } from '@docs/components/base';

export default function (props: MountProps): JSX.Element {
	const [Palette, palette] = paletteSelector('secondary');
	const [Rounded, rounded] = boolSelector('_d.demo.rounded');
	const [Help, help] = boolSelector('help');
	const [Disabled, disabled] = boolSelector('_d.demo.disabled');
	const [Readonly, readonly] = boolSelector('_d.demo.readonly');
	const [Layout, layout] = layoutSelector('_d.demo.componentLayout');

	const api = new Form.API({
		initValue: {
			f1: 'f1',
			f2: 5,
			date: new Date('2021-01-02T15:31'),
			textarea: 'textarea',
		},
		submit: async () => ({ ok: false, status: 500, body: { type: '500', title: '请求未处理', status: 500 } }),
		onProblem: p => Notify.notify('error', p.title),
	});

	return (
		<>
			<Portal mount={props.mount}>
				<Palette />
				<Rounded />
				<Help />
				<Layout />
				<Disabled />
				<Readonly />
				<Button.Root
					onclick={() => {
						api.setError(api.getError() ? undefined : 'error');
					}}
				>
					Set Error
				</Button.Root>
			</Portal>

			<Form.Root
				palette={palette()}
				rounded={rounded()}
				layout={layout()}
				hasHelp={help()}
				disabled={disabled()}
				readonly={readonly()}
				class="flex flex-col gap-4"
				api={api}
			>
				<Form.Message api={api} />
				<TextField.Root label="textField" accessor={api.accessor<string>('f1')} help="这是一个帮助文本" />
				<Numeric.Root label="number" accessor={api.accessor('f2')} help="这是一个帮助文本" />
				<DatePicker.Root label="date" accessor={api.accessor<Date, 'date'>('date')} help="这是一个帮助文本" />
				<TextArea.Root
					label="textarea"
					class="grow"
					accessor={api.accessor<string>('textarea')}
					help="这是一个帮助文本"
				/>
			</Form.Root>
			<div class="flex w-full justify-between">
				<Form.Reset>reset</Form.Reset>
				<Form.Submit>submit</Form.Submit>
			</div>
		</>
	);
}
