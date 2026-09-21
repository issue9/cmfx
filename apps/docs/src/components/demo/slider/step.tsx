// SPDX-FileCopyrightText: 2025-2026 caixw
//
// SPDX-License-Identifier: MIT

import type { MountProps } from '@cmfx/cdk';
import { Form, Slider } from '@cmfx/components';
import { Portal } from 'solid-js/web';

import { boolSelector, layoutSelector, stateSelector } from '@docs/components/base';

export default function (props: MountProps) {
	const [Layout, layout] = layoutSelector('_d.demo.componentLayout', 'horizontal');
	const [State, state] = stateSelector();
	const [FitHeight, fitHeight] = boolSelector('fitHeight', false);
	const [Rounded, rounded] = boolSelector('_d.demo.rounded', false);

	const [F, Field] = Form.create({ initValue: { a: 5 } });

	return (
		<>
			<Portal mount={props.mount}>
				<Layout />
				<State />
				<FitHeight />
				<Rounded />
			</Portal>

			<F>
				<Field layout={layout()} name="a" label="label">
					<Slider
						rounded={rounded()}
						format={v => `${v ? v.toFixed(2) : 0}%`}
						fitHeight={fitHeight()}
						palette="primary"
						step={0.5}
						min={0}
						max={100}
						state={state()}
					/>
				</Field>
			</F>
		</>
	);
}
