// SPDX-FileCopyrightText: 2024-2026 caixw
//
// SPDX-License-Identifier: MIT

import type { MountProps } from '@cmfx/cdk';
import { Form, InputNumber } from '@cmfx/components';
import { createSignal, type JSX } from 'solid-js';
import { Portal } from 'solid-js/web';
import IconFace from '~icons/material-symbols/face';

import { boolSelector, formStateSelector, layoutSelector, paletteSelector } from '@docs/components/base';

export default function (props: MountProps): JSX.Element {
	const [num, setNum] = createSignal(5);

	const [Palette, palette] = paletteSelector();
	const [State, state] = formStateSelector();
	const [Layout, layout] = layoutSelector('_d.demo.componentLayout', 'horizontal');
	const [Rounded, rounded] = boolSelector('_d.demo.rounded', false);

	return (
		<>
			<Portal mount={props.mount}>
				<Palette />
				<Rounded />
				<State />
				<Layout />
			</Portal>

			<div class="flex w-80 flex-col gap-2">
				<InputNumber
					placeholder="placeholder"
					palette={palette()}
					rounded={rounded()}
					state={state()}
					value={num()}
					onChange={setNum}
				/>

				<Form.Field label="icon" layout={layout()}>
					<InputNumber
						placeholder="placeholder"
						prefix={<IconFace class="self-center" />}
						palette={palette()}
						state={state()}
						rounded={rounded()}
						value={num()}
						onChange={setNum}
					/>
				</Form.Field>

				<Form.Field label="range:[1,10]" layout={layout()}>
					<InputNumber
						placeholder="placeholder"
						prefix={<IconFace class="self-center" />}
						min={1}
						max={10}
						palette={palette()}
						state={state()}
						rounded={rounded()}
						value={num()}
						onChange={setNum}
					/>
				</Form.Field>
			</div>
		</>
	);
}
