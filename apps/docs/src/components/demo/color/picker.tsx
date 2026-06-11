// SPDX-FileCopyrightText: 2025-2026 caixw
//
// SPDX-License-Identifier: MIT

import { Color, type MountProps } from '@cmfx/components';
import { createSignal, type JSX } from 'solid-js';
import { Portal } from 'solid-js/web';

import { boolSelector, paletteSelector } from '@docs/components/base';

export default function (props: MountProps): JSX.Element {
	const [Palette, palette] = paletteSelector();
	const [Disabled, disabled] = boolSelector('_d.demo.disabled');
	const [Readonly, readonly] = boolSelector('_d.demo.readonly');
	const [Rounded, rounded] = boolSelector('_d.demo.rounded');

	const [color, setColor] = createSignal<string | undefined>('oklch(1% 0.3 100)');

	return (
		<>
			<Portal mount={props.mount}>
				<Palette />
				<Disabled />
				<Readonly />
				<Rounded />
			</Portal>

			<Color
				popover="click"
				readonly={readonly()}
				disabled={disabled()}
				wcag="oklch(1 0 0)"
				palette={palette()}
				value={color()}
				onChange={v => setColor(v)}
				rounded={rounded()}
				activatorClass="border border-palette-border min-w-8 min-h-8"
				spaces={[new Color.TailwindVarsSpace(), new Color.OKLCHSpace(), new Color.HSLSpace(), new Color.RGBSpace()]}
			/>
		</>
	);
}
