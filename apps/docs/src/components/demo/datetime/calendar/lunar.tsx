// SPDX-FileCopyrightText: 2025-2026 caixw
//
// SPDX-License-Identifier: MIT

import type { MountProps, Week } from '@cmfx/components';
import { Calendar, datetimePluginLunar, Notify } from '@cmfx/components';
import type { JSX } from 'solid-js';
import { Portal } from 'solid-js/web';

import { boolSelector, numeric, paletteSelector } from '@docs/components/base';

export default function (props: MountProps): JSX.Element {
	const now = new Date();
	const min = new Date(now.getFullYear(), now.getMonth() - 2, now.getDate());
	const max = new Date(now.getFullYear(), now.getMonth() + 2, now.getDate());

	const [Palette, palette] = paletteSelector();
	const [Weekend, weekend] = boolSelector('weekend');
	const [Minmax, minmax] = boolSelector('minmax');
	const [Num, num] = numeric<Week>('每周起始于', 0, 0, 6);

	return (
		<>
			<Portal mount={props.mount}>
				<Palette />
				<Weekend />
				<Minmax />
				<Num />
			</Portal>

			<div class="h-[600px] w-full">
				<Calendar
					weekend={weekend()}
					weekBase={num()}
					palette={palette()}
					plugins={[datetimePluginLunar]}
					min={minmax() ? min : undefined}
					max={minmax() ? max : undefined}
					onSelected={(d: Date) => Notify.notify(d.toString())}
				/>
			</div>
		</>
	);
}
