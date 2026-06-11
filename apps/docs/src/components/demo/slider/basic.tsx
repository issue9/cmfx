// SPDX-FileCopyrightText: 2025-2026 caixw
//
// SPDX-License-Identifier: MIT

import { type MountProps, Slider } from '@cmfx/components';
import { createSignal } from 'solid-js';
import { Portal } from 'solid-js/web';

import { boolSelector, paletteSelector } from '@docs/components/base';

export default function (props: MountProps) {
	const [val, setVal] = createSignal(5);

	const [Disabled, disabled] = boolSelector('_d.demo.disabled');
	const [Readonly, readonly] = boolSelector('_d.demo.readonly');
	const [FitHeight, fitHeight] = boolSelector('fitHeight', false);
	const [Rounded, rounded] = boolSelector('_d.demo.rounded', false);
	const [Palette, palette] = paletteSelector();

	return (
		<>
			<Portal mount={props.mount}>
				<Palette />
				<Readonly />
				<Disabled />
				<FitHeight />
				<Rounded />
			</Portal>

			<div>
				<Slider
					rounded={rounded()}
					fitHeight={fitHeight()}
					value={val()}
					onChange={setVal}
					palette="primary"
					disabled={disabled()}
					readonly={readonly()}
				/>

				<Slider
					rounded={rounded()}
					value={val()}
					onChange={setVal}
					fitHeight={fitHeight()}
					palette={palette()}
					disabled={disabled()}
					readonly={readonly()}
				/>
			</div>
		</>
	);
}
