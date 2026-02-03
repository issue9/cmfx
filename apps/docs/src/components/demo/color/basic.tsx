// SPDX-FileCopyrightText: 2025-2026 caixw
//
// SPDX-License-Identifier: MIT

import {
	ColorPanel,
	ColorPickerPanelHSL,
	ColorPickerPanelOKLCH,
	ColorPickerPanelPreset,
	ColorPickerPanelRGB,
	ColorPickerPanelTailwind,
	ColorPickerPanelWebSafe,
	MountProps,
} from '@cmfx/components';
import { JSX } from 'solid-js';
import { Portal } from 'solid-js/web';

import { paletteSelector } from '@docs/components/base';

export default function (props: MountProps): JSX.Element {
	const [Palette, palette] = paletteSelector();

	return (
		<>
			<Portal mount={props.mount}>
				<Palette />
			</Portal>

			<ColorPanel
				palette={palette()}
				value="rgb(255 10 10)"
				pickers={[
					new ColorPickerPanelTailwind(),
					new ColorPickerPanelOKLCH(),
					new ColorPickerPanelHSL(),
					new ColorPickerPanelRGB(),
					new ColorPickerPanelWebSafe(),
					new ColorPickerPanelPreset('#fff', '#000', 'white', 'oklch(1 1 1)', 'rgb(1 2 3)'),
				]}
			></ColorPanel>
		</>
	);
}
