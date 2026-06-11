// SPDX-FileCopyrightText: 2024-2026 caixw
//
// SPDX-License-Identifier: MIT

import { Form, type MountProps, TextArea } from '@cmfx/components';
import { createSignal, type JSX } from 'solid-js';
import { Portal } from 'solid-js/web';

import { boolSelector, layoutSelector } from '@docs/components/base';

export default function (props: MountProps): JSX.Element {
	const [txt, setTxt] = createSignal('5');
	const [Disabled, disabled] = boolSelector('_d.demo.disabled');
	const [Readonly, readonly] = boolSelector('_d.demo.readonly');
	const [Layout, layout] = layoutSelector('_d.demo.componentLayout', 'horizontal');
	const [Count, count] = boolSelector('_d.demo.charCount', false);

	return (
		<div>
			<Portal mount={props.mount}>
				<Readonly />
				<Disabled />
				<Layout />
				<Count />
			</Portal>
			<TextArea
				count={count()}
				palette="primary"
				disabled={disabled()}
				readonly={readonly()}
				value={txt()}
				onChange={setTxt}
			/>

			<Form api={new Form.API({ initValue: {} })}>
				<Form.Field layout={layout()} label="error" help="help">
					<TextArea
						count={count()}
						palette="error"
						disabled={disabled()}
						readonly={readonly()}
						value={txt()}
						onChange={setTxt}
					/>
				</Form.Field>
			</Form>
		</div>
	);
}
