// SPDX-FileCopyrightText: 2024-2026 caixw
//
// SPDX-License-Identifier: MIT

import { joinClass, type MountProps } from '@cmfx/components';
import type { JSX } from 'solid-js';
import { Portal } from 'solid-js/web';
import IconClose from '~icons/material-symbols/close';
import IconFace from '~icons/material-symbols/face';
import IconPerson from '~icons/material-symbols/person';

import { paletteSelector } from '@docs/components/base';

export default function (props: MountProps): JSX.Element {
	const [Palette, palette] = paletteSelector();

	return (
		<>
			<Portal mount={props.mount}>
				<Palette />
			</Portal>

			<div class={joinClass(palette())}>
				<IconFace class="rounded-full bg-palette-bg-low hover:text-palette-fg-high" />
				<IconPerson class="border border-palette-fg-high" />

				<span class="flex w-full items-center border border-red-500 bg-palette-fg-high">
					<IconFace />
					与文字文字平行
					<IconClose />
				</span>
				<span class="flex w-full items-center border border-red-500 text-8xl">
					<IconFace />
					与文字平行 6rem
					<IconClose />
				</span>

				<span class="flex h-12 w-full items-center border border-red-500 bg-palette-bg text-palette-fg">
					<IconFace />
					与文字文字平行
					<IconFace />
				</span>
			</div>
		</>
	);
}
