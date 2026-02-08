// SPDX-FileCopyrightText: 2025-2026 caixw
//
// SPDX-License-Identifier: MIT

import { Empty, MountProps } from '@cmfx/components';
import { JSX } from 'solid-js';
import { Portal } from 'solid-js/web';
import IconEye from '~icons/material-symbols/eyeglasses';

import { paletteSelector } from '@docs/components/base';

export default function (props: MountProps): JSX.Element {
	const [Palette, palette] = paletteSelector();

	return (
		<>
			<Portal mount={props.mount}>
				<Palette />
			</Portal>

			<Empty palette={palette()} icon={<IconEye class="text-5xl" />}>
				说点什么呢？
			</Empty>
		</>
	);
}
