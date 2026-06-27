// SPDX-FileCopyrightText: 2024-2026 caixw
//
// SPDX-License-Identifier: MIT

import type { MountProps } from '@cmfx/components';
import { Button, DatePicker, Form, InputNumber, InputText, Notify, TextArea } from '@cmfx/components';
import type { JSX } from 'solid-js';
import { Portal } from 'solid-js/web';

import { boolSelector, layoutSelector, paletteSelector } from '@docs/components/base';

export default function (props: MountProps): JSX.Element {
	const [Palette, palette] = paletteSelector('secondary');
	const [Rounded, rounded] = boolSelector('_d.demo.rounded');
	const [Feedback, feedback] = boolSelector('_d.demo.feedback', true);
	const [Disabled, disabled] = boolSelector('_d.demo.disabled');
	const [Readonly, readonly] = boolSelector('_d.demo.readonly');
	const [Layout, layout] = layoutSelector('_d.demo.componentLayout');

	const [F, Field, api] = Form.create({
		initValue: {
			f1: 'f1',
			f2: 5,
			date: new Date('2021-01-02T15:31'),
			textarea: 'textarea',
		},
		submit: async () => ({ ok: false, status: 500, body: { type: '500', title: '请求未处理', status: 500 } }),
		onProblem: p => Notify.notify('error', p?.title),
	});

	return (
		<>
			<Portal mount={props.mount}>
				<Palette />
				<Rounded />
				<Layout />
				<Disabled />
				<Readonly />
				<Feedback />
				<Button
					onclick={() => {
						api.setError(api.getError() ? undefined : 'error');
					}}
				>
					Set Error
				</Button>
			</Portal>

			<F
				palette={palette()}
				rounded={rounded()}
				layout={layout()}
				disabled={disabled()}
				readonly={readonly()}
				feedback={feedback()}
				class="flex flex-col gap-4"
			>
				<Form.Message />

				<Field label="textField" help="这是一个帮助文本" name="f1">
					<InputText count />
				</Field>

				<Field label="number" help="这是一个帮助文本" name="f2">
					<InputNumber />
				</Field>

				<Field label="date" help="这是一个帮助文本" name="date">
					<DatePicker />
				</Field>

				<Field class="grow" label="textarea" help="这是一个帮助文本" name="textarea">
					<TextArea />
				</Field>

				<div class="flex w-full justify-between">
					<Form.Reset>reset</Form.Reset>
					<Form.Submit>submit</Form.Submit>
				</div>
			</F>
		</>
	);
}
