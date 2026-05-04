// SPDX-FileCopyrightText: 2026 caixw
//
// SPDX-License-Identifier: MIT

import { ColorPanel, ColorPicker, Form1, type MountProps } from '@cmfx/components';
import type { JSX } from 'solid-js';
import { Portal } from 'solid-js/web';
import IconPerson from '~icons/material-symbols/person';

import { boolSelector, layoutSelector, paletteSelector } from '@docs/components/base';

export default function (props: MountProps): JSX.Element {
	const [Palette, palette] = paletteSelector();
	const [Layout, layout] = layoutSelector('_d.demo.componentLayout', 'horizontal');
	const [Disabled, disabled] = boolSelector('_d.demo.disabled');
	const [Readonly, readonly] = boolSelector('_d.demo.readonly');
	const [Rounded, rounded] = boolSelector('_d.demo.rounded');

	const color = Form1.fieldAccessor('color', 'oklch(1% 0.3 100)');

	return (
		<>
			<Portal mount={props.mount}>
				<Palette />
				<Disabled />
				<Readonly />
				<Rounded />
				<Layout />
			</Portal>

			<ColorPicker.Root
				readonly={readonly()}
				disabled={disabled()}
				palette={palette()}
				layout={layout()}
				accessor={color}
				label="picker label"
				rounded={rounded()}
				pickers={[
					new ColorPanel.TailwindVarsPickerPanel(),
					new ColorPanel.OKLCHPickerPanel(),
					new ColorPanel.HSLPickerPanel(),
					new ColorPanel.RGBPickerPanel(),
				]}
			>
				<IconPerson />
			</ColorPicker.Root>
		</>
	);
}
