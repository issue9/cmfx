// SPDX-FileCopyrightText: 2025-2026 caixw
//
// SPDX-License-Identifier: MIT

import { Button, Form, type MountProps, Time } from '@cmfx/components';
import { createSignal, type JSX } from 'solid-js';
import { Portal } from 'solid-js/web';

import { boolSelector, paletteSelector } from '@docs/components/base';

export default function (props: MountProps): JSX.Element {
	const [Palette, palette] = paletteSelector('primary');
	const [Disabled, disabled] = boolSelector('_d.demo.disabled');
	const [Readonly, readonly] = boolSelector('_d.demo.readonly');

	const [val, setValue] = createSignal<Date>();
	const [valShow, setValShow] = createSignal<string>('');
	const [F, Field] = Form.create({ initValue: { a: new Date() } });

	return (
		<div>
			<Portal mount={props.mount}>
				<Palette />
				<Disabled />
				<Readonly />
				<Button.Root onclick={() => setValue()}>set undefined</Button.Root>
				<Button.Root onclick={() => setValue(new Date())}>now</Button.Root>
			</Portal>

			<F class="flex flex-col items-start">
				<Field name="a">
					<Time.Root
						palette={palette()}
						readonly={readonly()}
						disabled={disabled()}
						value={val()}
						onChange={(val, old) => {
							setValShow(`new:${val}old:${old}`);
							setValue(val);
						}}
					/>
				</Field>
				<p>{valShow()}</p>
				<p>{val()?.toString()}</p>
			</F>
		</div>
	);
}
