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
				wcag="oklch(10% .5 .5)"
				palette={palette()}
				value="rgb(255 10 10)"
				pickers={[
					new ColorPanel.TailwindVarsPickerPanel(),
					new ColorPanel.OKLCHPickerPanel(),
					new ColorPanel.HSLPickerPanel(),
					new ColorPanel.RGBPickerPanel(),
				]}
			></ColorPanel.Root>
		</>
	);
}
