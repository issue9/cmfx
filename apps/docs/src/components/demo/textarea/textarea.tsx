// SPDX-FileCopyrightText: 2024-2026 caixw
//
// SPDX-License-Identifier: MIT

import type { MountProps } from '@cmfx/cdk';
import { Form, TextArea } from '@cmfx/components';
import { createSignal, type JSX } from 'solid-js';
import { Portal } from 'solid-js/web';

import { boolSelector, layoutSelector, stateSelector } from '@docs/components/base';

export default function (props: MountProps): JSX.Element {
	const [txt, setTxt] = createSignal('5');
	const [Layout, layout] = layoutSelector('_d.demo.componentLayout', 'horizontal');
	const [State, state] = stateSelector();
	const [Count, count] = boolSelector('_d.demo.charCount', false);

	return (
		<div>
			<Portal mount={props.mount}>
				<Layout />
				<State />
				<Count />
			</Portal>
			<TextArea count={count()} palette="primary" value={txt()} state={state()} onChange={setTxt} />

			<Form initValue={{ initValue: {} }}>
				<Form.Field layout={layout()} label="error" help="help">
					<TextArea count={count()} palette="error" state={state()} value={txt()} onChange={setTxt} />
				</Form.Field>
			</Form>
		</div>
	);
}
