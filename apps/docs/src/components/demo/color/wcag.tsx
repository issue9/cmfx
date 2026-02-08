// SPDX-FileCopyrightText: 2025-2026 caixw
//
// SPDX-License-Identifier: MIT

import {
	ColorPanel,
	ColorPickerPanelHSL,
	ColorPickerPanelOKLCH,
	ColorPickerPanelRGB,
	ColorPickerPanelTailwind,
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
				wcag="oklch(10% .5 .5)"
				palette={palette()}
				value="rgb(255 10 10)"
				pickers={[
					new ColorPickerPanelTailwind(),
					new ColorPickerPanelOKLCH(),
					new ColorPickerPanelHSL(),
					new ColorPickerPanelRGB(),
				]}
			></ColorPanel>
		</>
	);
}
