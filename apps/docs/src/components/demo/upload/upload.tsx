// SPDX-FileCopyrightText: 2024-2026 caixw
//
// SPDX-License-Identifier: MIT

import { Album, type MountProps } from '@cmfx/components';
import { createSignal, type JSX } from 'solid-js';
import { Portal } from 'solid-js/web';

import { boolSelector, layoutSelector, paletteSelector } from '@docs/components/base';

export default function (props: MountProps): JSX.Element {
	const [Reverse, reverse] = boolSelector('reverse');
	const [Auto, auto] = boolSelector('auto');
	const [Palette, palette] = paletteSelector();
	const [Disabled, disabled] = boolSelector('_d.demo.disabled');
	const [Layout, layout] = layoutSelector('_d.demo.componentLayout', 'horizontal');

	const basicA = createSignal(['../../../../../../apps/admin/public/icon.svg', './test.jpg']);

	return (
		<>
			<Portal mount={props.mount}>
				<Palette />
				<Disabled />
				<Reverse />
				<Auto />
				<Layout />
			</Portal>

			<div title="basic">
				<Album
					hasHelp
					layout={layout()}
					fieldName="file"
					label="label"
					class="min-w-16"
					reverse={reverse()}
					disabled={disabled()}
					palette={palette()}
					auto={auto()}
					value={basicA[0]()}
					onChange={v => basicA[1](v)}
					upload={async () => []}
				/>
			</div>

			<div title="basic+drop">
				<Album
					hasHelp
					layout={layout()}
					fieldName="file"
					class="min-w-16"
					reverse={reverse()}
					disabled={disabled()}
					palette={palette()}
					droppable
					auto={auto()}
					value={basicA[0]()}
					onChange={v => basicA[1](v)}
					upload={async () => []}
				/>
			</div>
		</>
	);
}
