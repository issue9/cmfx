// SPDX-FileCopyrightText: 2025-2026 caixw
//
// SPDX-License-Identifier: MIT

import { Form, type MountProps, Slider } from '@cmfx/components';
import { Portal } from 'solid-js/web';

import { boolSelector, layoutSelector } from '@docs/components/base';

export default function (props: MountProps) {
	const [Disabled, disabled] = boolSelector('_d.demo.disabled');
	const [Readonly, readonly] = boolSelector('_d.demo.readonly');
	const [Layout, layout] = layoutSelector('_d.demo.componentLayout', 'horizontal');
	const [FitHeight, fitHeight] = boolSelector('fitHeight', false);
	const [Rounded, rounded] = boolSelector('_d.demo.rounded', false);

	const [F, Field] = Form.create({ initValue: { a: 5 } });

	return (
		<>
			<Portal mount={props.mount}>
				<Readonly />
				<Disabled />
				<Layout />
				<FitHeight />
				<Rounded />
			</Portal>

			<F>
				<Field layout={layout()} name="a" label="label">
					<Slider.Root
						rounded={rounded()}
						format={v => `${v ? v.toFixed(2) : 0}%`}
						fitHeight={fitHeight()}
						palette="primary"
						step={0.5}
						min={0}
						max={100}
						disabled={disabled()}
						readonly={readonly()}
					/>
				</Field>
			</F>
		</>
	);
}
