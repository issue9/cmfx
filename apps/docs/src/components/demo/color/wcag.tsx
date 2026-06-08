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

			<Color.Root
				wcag="oklch(10% .5 .5)"
				palette={palette()}
				value="rgb(255 10 10)"
				spaces={[new Color.TailwindVarsSpace(), new Color.OKLCHSpace(), new Color.HSLSpace(), new Color.RGBSpace()]}
			></Color.Root>
		</>
	);
}
