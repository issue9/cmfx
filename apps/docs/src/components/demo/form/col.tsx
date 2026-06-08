// SPDX-FileCopyrightText: 2024-2026 caixw
//
// SPDX-License-Identifier: MIT

import { DatePicker, Form, InputNumber, InputText, type MountProps, TextArea } from '@cmfx/components';
import type { JSX } from 'solid-js';
import { Portal } from 'solid-js/web';

import { boolSelector, labelAlignSelector, layoutSelector, paletteSelector } from '@docs/components/base';

export default function (props: MountProps): JSX.Element {
	const [Palette, palette] = paletteSelector('secondary');
	const [Rounded, rounded] = boolSelector('_d.demo.rounded');
	const [Feedback, feedback] = boolSelector('feedback');
	const [Disabled, disabled] = boolSelector('_d.demo.disabled');
	const [Readonly, readonly] = boolSelector('_d.demo.readonly');
	const [Layout, layout] = layoutSelector('_d.demo.componentLayout');
	const [LabelAlign, labelAlign] = labelAlignSelector('start');

	const [F, Field] = Form.create({
		initValue: {
			f1: 'f1',
			f2: 5,
			date: new Date('2021-01-02T15:31'),
			textarea: 'textarea',
		},
		submit: async () => ({ ok: false, status: 500, body: { type: '500', title: '请求未处理', status: 500 } }),
	});

	return (
		<>
			<Portal mount={props.mount}>
				<Palette />
				<Rounded />
				<Feedback />
				<Layout />
				<Disabled />
				<Readonly />
				<LabelAlign />
			</Portal>

			<F
				palette={palette()}
				rounded={rounded()}
				layout={layout()}
				feedback={feedback()}
				class="grid grid-cols-2 gap-2"
				disabled={disabled()}
				readonly={readonly()}
				labelWidth="70px"
				labelAlign={labelAlign()}
			>
				<Field label="textField" name="f1" help="这是一个帮助文本">
					<InputText.Root />
				</Field>

				<Field label="number" name="f2" help="这是一个帮助文本">
					<InputNumber.Root />
				</Field>

				<Field label="date" name="date" help="这是一个帮助文本">
					<DatePicker.Root />
				</Field>

				<Field label="textarea" name="textarea" help="这是一个帮助文本">
					<TextArea.Root />
				</Field>

				<div class="col-span-full flex justify-between">
					<Form.Reset>reset</Form.Reset>
					<Form.Submit>submit</Form.Submit>
				</div>
			</F>
		</>
	);
}
