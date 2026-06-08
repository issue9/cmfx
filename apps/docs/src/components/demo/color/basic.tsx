// SPDX-FileCopyrightText: 2025-2026 caixw
//
// SPDX-License-Identifier: MIT

import { Color, type MountProps } from '@cmfx/components';
import { createSignal, type JSX } from 'solid-js';
import { Portal } from 'solid-js/web';

import { paletteSelector } from '@docs/components/base';

export default function (props: MountProps): JSX.Element {
	const [Palette, palette] = paletteSelector();
	const [val, setVal] = createSignal();

	return (
		<>
			<Portal mount={props.mount}>
				<Palette />
			</Portal>

			<Color.Root
				palette={palette()}
				value={val()}
				onChange={setVal}
				spaces={[
					new Color.TailwindVarsSpace(),
					new Color.OKLCHSpace(),
					new Color.HSLSpace(),
					new Color.RGBSpace(),
					new Color.WebSafeSpace(),
					new Color.PresetSpace('#fff', '#000', 'white', 'oklch(1 1 1)', 'rgb(1 2 3)'),
				]}
			></Color.Root>
		</>
	);
}
