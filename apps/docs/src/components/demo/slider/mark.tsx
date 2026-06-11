// SPDX-FileCopyrightText: 2025-2026 caixw
//
// SPDX-License-Identifier: MIT

import { type MountProps, Slider } from '@cmfx/components';
import { createSignal } from 'solid-js';
import { Portal } from 'solid-js/web';

import { boolSelector } from '@docs/components/base';

export default function (props: MountProps) {
	const [val, setVal] = createSignal(5);

	const [Disabled, disabled] = boolSelector('_d.demo.disabled');
	const [Readonly, readonly] = boolSelector('_d.demo.readonly');
	const [FitHeight, fitHeight] = boolSelector('fitHeight', false);
	const [Rounded, rounded] = boolSelector('_d.demo.rounded', false);

	return (
		<>
			<Portal mount={props.mount}>
				<Readonly />
				<Disabled />
				<FitHeight />
				<Rounded />
			</Portal>

			<div>
				<Slider
					rounded={rounded()}
					value={val()}
					onChange={setVal}
					fitHeight={fitHeight()}
					palette="primary"
					disabled={disabled()}
					readonly={readonly()}
					step={10}
					min={0}
					max={100}
					marks={[
						[0, '0'],
						[30, '30'],
						[50, '50'],
						[80, '80'],
						[100, 'last'],
					]}
				/>
			</div>

			<div>
				<Slider
					rounded={rounded()}
					class="min-w-90"
					fitHeight={fitHeight()}
					value={val()}
					onChange={setVal}
					palette="primary"
					disabled={disabled()}
					readonly={readonly()}
					step={10}
					min={0}
					max={130}
					marks={[
						[0, '0'],
						[30, '30'],
						[50, '50'],
						[80, '80'],
						[130, 'last'],
					]}
				/>
			</div>
		</>
	);
}
