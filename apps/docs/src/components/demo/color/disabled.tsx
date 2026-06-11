// SPDX-FileCopyrightText: 2025-2026 caixw
//
// SPDX-License-Identifier: MIT

import { Color, type MountProps } from '@cmfx/components';
import type { JSX } from 'solid-js';
import { Portal } from 'solid-js/web';

import { paletteSelector } from '@docs/components/base';

export default function (props: MountProps): JSX.Element {
	const [Palette, palette] = paletteSelector();

	return (
		<>
			<Portal mount={props.mount}>
				<Palette />
			</Portal>

			<Color
				palette={palette()}
				value="rgb(255 10 10)"
				spaces={[
					new Color.TailwindVarsSpace('var(--color-red-50)', 'var(--color-red-100)'),
					new Color.OKLCHSpace(0.5, undefined, undefined, 0.3),
					new Color.HSLSpace(170, undefined, 55.5),
					new Color.RGBSpace(0.5, undefined, 0.3),
					new Color.WebSafeSpace('#fff', '#000'),
					new Color.PresetSpace('#fff', '#000', 'white', 'oklch(1 1 1)', 'rgb(1 2 3)'),
				]}
			></Color>
		</>
	);
}
