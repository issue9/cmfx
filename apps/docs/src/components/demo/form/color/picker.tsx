// SPDX-FileCopyrightText: 2025-2026 caixw
//
// SPDX-License-Identifier: MIT

import { ColorPanel, ColorPicker, Form, type MountProps } from '@cmfx/components';
import type { JSX } from 'solid-js';
import { Portal } from 'solid-js/web';

import { boolSelector, layoutSelector, paletteSelector } from '@docs/components/base';

export default function (props: MountProps): JSX.Element {
	const [Palette, palette] = paletteSelector();
	const [Layout, layout] = layoutSelector('_d.demo.componentLayout', 'horizontal');
	const [Disabled, disabled] = boolSelector('_d.demo.disabled');
	const [Readonly, readonly] = boolSelector('_d.demo.readonly');
	const [Rounded, rounded] = boolSelector('_d.demo.rounded');

	const color = Form.fieldAccessor('color', 'oklch(1% 0.3 100)');

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
				wcag="oklch(1 0 0)"
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
			/>
		</>
	);
}
