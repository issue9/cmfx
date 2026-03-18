// SPDX-FileCopyrightText: 2024-2026 caixw
//
// SPDX-License-Identifier: MIT

import { Description, type MountProps } from '@cmfx/components';
import type { JSX } from 'solid-js';
import { Portal } from 'solid-js/web';
import IconEye from '~icons/material-symbols/table-eye';

import { paletteSelector } from '@docs/components/base';

export default function (props: MountProps): JSX.Element {
	const [Palette, palette] = paletteSelector();

	return (
		<div>
			<Portal mount={props.mount}>
				<Palette />
			</Portal>

			<Description.Root palette={palette()} icon={<IconEye />} title="title">
				description
				<br />
				description
			</Description.Root>

			<br />
			<br />

			<Description.Root palette={palette()}>
				无标题
				<br />
				description
			</Description.Root>
		</div>
	);
}
