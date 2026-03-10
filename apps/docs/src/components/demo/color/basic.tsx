// SPDX-FileCopyrightText: 2025-2026 caixw
//
// SPDX-License-Identifier: MIT

import { ColorPanel, MountProps } from '@cmfx/components';
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

			<ColorPanel.Root
				palette={palette()}
				value="rgb(255 10 10)"
				pickers={[
					new ColorPanel.TailwindVarsPickerPanel(),
					new ColorPanel.OKLCHPickerPanel(),
					new ColorPanel.HSLPickerPanel(),
					new ColorPanel.RGBPickerPanel(),
					new ColorPanel.WebSafePickerPanel(),
					new ColorPanel.PresetPickerPanel('#fff', '#000', 'white', 'oklch(1 1 1)', 'rgb(1 2 3)'),
				]}
			></ColorPanel.Root>
		</>
	);
}
