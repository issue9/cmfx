// SPDX-FileCopyrightText: 2024-2026 caixw
//
// SPDX-License-Identifier: MIT

import { CheckboxGroup, Form, type MountProps } from '@cmfx/components';
import { createSignal, type JSX } from 'solid-js';
import { Portal } from 'solid-js/web';

import { boolSelector, labelAlignSelector, layoutSelector } from '@docs/components/base';

export default function (props: MountProps): JSX.Element {
	const [Layout, layout] = layoutSelector('_d.demo.componentLayout');
	const [ItemLayout, itemLayout] = layoutSelector('_d.demo.itemLayout');
	const [Disabled, disabled] = boolSelector('_d.demo.disabled');
	const [Readonly, readonly] = boolSelector('_d.demo.readonly');
	const [Block, block] = boolSelector('_d.demo.block');
	const [Rounded, rounded] = boolSelector('_d.demo.rounded');
	const [LabelAlign, labelAlign] = labelAlignSelector('start');

	const [group, setGroup] = createSignal(['1']);
	const groupOptions: CheckboxGroup.Options<string> = [
		{ value: '1', label: <div>abc</div> },
		{ value: '2', label: <div style="color:red">red</div> },
		{
			value: '3',
			label: (
				<div style="color:red">
					red
					<br />
					red
					<br />
					red
				</div>
			),
		},
	];

	const [F, Field] = Form.create({ initValue: { a: ['1'] } });

	return (
		<div>
			<Portal mount={props.mount}>
				<Readonly />
				<Disabled />
				<Block />
				<Rounded />
				<Layout />
				<ItemLayout />
				<LabelAlign />
			</Portal>

			<div>
				<F>
					<Field
						palette="primary"
						label="group"
						layout={layout()}
						help="help text"
						labelAlign={labelAlign()}
						labelWidth="100px"
					>
						<CheckboxGroup.Root
							rounded={rounded()}
							disabled={disabled()}
							readonly={readonly()}
							layout={itemLayout()}
							block={block()}
							options={groupOptions}
							value={group()}
							onChange={n => setGroup(n)}
						/>
					</Field>
				</F>
				<pre>{group().join(',')}</pre>
			</div>
		</div>
	);
}
