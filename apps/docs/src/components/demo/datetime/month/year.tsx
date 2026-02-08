// SPDX-FileCopyrightText: 2025-2026 caixw
//
// SPDX-License-Identifier: MIT

import { MountProps, YearPanel } from '@cmfx/components';
import { createSignal, JSX } from 'solid-js';
import { Portal } from 'solid-js/web';

import { boolSelector, paletteSelector } from '@docs/components/base';

export default function (props: MountProps): JSX.Element {
	const [Palette, palette] = paletteSelector('primary');
	const [Disabled, disabled] = boolSelector('_d.demo.disabled');
	const [Readonly, readonly] = boolSelector('_d.demo.readonly');
	const [Minmax, minmax] = boolSelector('minmax');

	const [year, setYearValue] = createSignal<number | undefined>(new Date().getFullYear());
	const [yearShow, setYearShow] = createSignal<string>('');

	const now = new Date();
	return (
		<div>
			<Portal mount={props.mount}>
				<Palette />
				<Disabled />
				<Readonly />
				<Minmax />
			</Portal>

			<div title="panel" class="flex items-start">
				<YearPanel
					palette={palette()}
					readonly={readonly()}
					disabled={disabled()}
					value={year()}
					min={minmax() ? now.getFullYear() - 2 : undefined}
					max={minmax() ? now.getFullYear() + 8 : undefined}
					onChange={(val, old) => {
						setYearShow(`new:${val}old:${old}`);
						setYearValue(val);
					}}
				/>
				<p>{yearShow()}</p>
			</div>
		</div>
	);
}
