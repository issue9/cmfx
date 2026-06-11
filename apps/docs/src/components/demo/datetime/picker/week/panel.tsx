// SPDX-FileCopyrightText: 2025-2026 caixw
//
// SPDX-License-Identifier: MIT

import { Button, type MountProps, WeekPicker, type WeekValueType } from '@cmfx/components';
import { getISOWeek } from '@cmfx/core';
import { createSignal, type JSX } from 'solid-js';
import { Portal } from 'solid-js/web';

import { boolSelector, paletteSelector } from '@docs/components/base';

export default function (props: MountProps): JSX.Element {
	const [Palette, palette] = paletteSelector('primary');
	const [Disabled, disabled] = boolSelector('_d.demo.disabled');
	const [Readonly, readonly] = boolSelector('_d.demo.readonly');

	const [value, setValue] = createSignal<WeekValueType | undefined>(undefined);
	const [valShow, setValShow] = createSignal<string>('');

	return (
		<div>
			<Portal mount={props.mount}>
				<Palette />
				<Disabled />
				<Readonly />
				<Button onclick={() => setValue()}>set undefined</Button>
				<Button onclick={() => setValue(getISOWeek(new Date()))}>now</Button>
			</Portal>

			<div title="panel" class="flex flex-col items-start">
				<WeekPicker
					palette={palette()}
					readonly={readonly()}
					disabled={disabled()}
					value={value()}
					onChange={(val, old) => {
						setValShow(`new:${val}old:${old}`);
						setValue(val);
					}}
				/>
				<p>{valShow()}</p>
			</div>
		</div>
	);
}
