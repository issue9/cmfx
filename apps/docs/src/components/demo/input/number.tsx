// SPDX-FileCopyrightText: 2024-2026 caixw
//
// SPDX-License-Identifier: MIT

import { Form, InputNumber, type MountProps } from '@cmfx/components';
import { createSignal, type JSX } from 'solid-js';
import { Portal } from 'solid-js/web';
import IconFace from '~icons/material-symbols/face';

import { boolSelector, layoutSelector, paletteSelector } from '@docs/components/base';

export default function (props: MountProps): JSX.Element {
	const [num, setNum] = createSignal(5);

	const [Palette, palette] = paletteSelector();
	const [Disabled, disabled] = boolSelector('_d.demo.disabled');
	const [Readonly, readonly] = boolSelector('_d.demo.readonly');
	const [Layout, layout] = layoutSelector('_d.demo.componentLayout', 'horizontal');
	const [Rounded, rounded] = boolSelector('_d.demo.rounded', false);

	return (
		<>
			<Portal mount={props.mount}>
				<Palette />
				<Readonly />
				<Rounded />
				<Disabled />
				<Layout />
			</Portal>

			<div class="flex w-80 flex-col gap-2">
				<InputNumber.Root
					placeholder="placeholder"
					palette={palette()}
					disabled={disabled()}
					rounded={rounded()}
					readonly={readonly()}
					value={num()}
					onChange={setNum}
				/>

				<Form.Field label="icon" layout={layout()}>
					<InputNumber.Root
						placeholder="placeholder"
						prefix={<IconFace class="self-center" />}
						palette={palette()}
						disabled={disabled()}
						rounded={rounded()}
						readonly={readonly()}
						value={num()}
						onChange={setNum}
					/>
				</Form.Field>

				<Form.Field label="range:[1,10]" layout={layout()}>
					<InputNumber.Root
						placeholder="placeholder"
						prefix={<IconFace class="self-center" />}
						min={1}
						max={10}
						palette={palette()}
						disabled={disabled()}
						rounded={rounded()}
						readonly={readonly()}
						value={num()}
						onChange={setNum}
					/>
				</Form.Field>
			</div>
		</>
	);
}
