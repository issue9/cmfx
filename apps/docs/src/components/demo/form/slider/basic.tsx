// SPDX-FileCopyrightText: 2025-2026 caixw
//
// SPDX-License-Identifier: MIT

import { Button, fieldAccessor, type MountProps, Slider } from '@cmfx/components';
import type { JSX } from 'solid-js';
import { Portal } from 'solid-js/web';

import { boolSelector, layoutSelector, paletteSelector } from '@docs/components/base';

function formatValue(value: number): JSX.Element {
	return `${value.toFixed(2)}%`;
}

export default function (props: MountProps) {
	const f = fieldAccessor('name', 5);

	const [Disabled, disabled] = boolSelector('_d.demo.disabled');
	const [Readonly, readonly] = boolSelector('_d.demo.readonly');
	const [Layout, layout] = layoutSelector('_d.demo.componentLayout', 'horizontal');
	const [FitHeight, fitHeight] = boolSelector('fitHeight', false);
	const [Value, value] = boolSelector('value', false);
	const [Rounded, rounded] = boolSelector('_d.demo.rounded', false);
	const [Palette, palette] = paletteSelector();

	return (
		<>
			<Portal mount={props.mount}>
				<Palette />
				<Readonly />
				<Disabled />
				<Layout />
				<FitHeight />
				<Value />
				<Rounded />
				<Button.Root palette="primary" onclick={() => f.setError(f.getError() ? undefined : 'error')}>
					toggle error
				</Button.Root>
			</Portal>

			<div>
				<Slider.Root
					hasHelp
					rounded={rounded()}
					value={value() ? formatValue : undefined}
					fitHeight={fitHeight()}
					label="label"
					accessor={f}
					palette="primary"
					disabled={disabled()}
					readonly={readonly()}
					layout={layout()}
				/>

				<Slider.Root
					hasHelp
					rounded={rounded()}
					value={value() ? formatValue : undefined}
					fitHeight={fitHeight()}
					label="label"
					accessor={f}
					palette={palette()}
					disabled={disabled()}
					readonly={readonly()}
					layout={layout()}
				/>
			</div>
		</>
	);
}
