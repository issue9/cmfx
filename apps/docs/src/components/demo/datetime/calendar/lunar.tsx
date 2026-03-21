// SPDX-FileCopyrightText: 2025-2026 caixw
//
// SPDX-License-Identifier: MIT

import type { MountProps, Week } from '@cmfx/components';
import { Calendar, datetimePluginLunar, Form, Notify, Numeric } from '@cmfx/components';
import type { JSX } from 'solid-js';
import { Portal } from 'solid-js/web';

import { boolSelector, paletteSelector } from '@docs/components/base';

export default function (props: MountProps): JSX.Element {
	const now = new Date();
	const min = new Date(now.getFullYear(), now.getMonth() - 2, now.getDate());
	const max = new Date(now.getFullYear(), now.getMonth() + 2, now.getDate());

	const [Palette, palette] = paletteSelector();
	const [Weekend, weekend] = boolSelector('weekend');
	const [Minmax, minmax] = boolSelector('minmax');
	const week = Form.fieldAccessor<Week>('weekbase', 0);

	return (
		<>
			<Portal mount={props.mount}>
				<Palette />
				<Weekend />
				<Minmax />
				<Numeric.Root min={0} max={6} class="w-20" placeholder="每周起始于" accessor={week} />
			</Portal>

			<div class="h-[600px] w-full">
				<Calendar.Root
					weekend={weekend()}
					weekBase={week.getValue()}
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
