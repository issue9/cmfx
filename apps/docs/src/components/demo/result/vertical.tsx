// SPDX-FileCopyrightText: 2024-2026 caixw
//
// SPDX-License-Identifier: MIT

import { type MountProps, Result } from '@cmfx/components';
import { Amico } from '@cmfx/illustrations';
import type { JSX } from 'solid-js';
import { Portal } from 'solid-js/web';

import { paletteSelector } from '@docs/components/base';

export default function (props: MountProps): JSX.Element {
	const [Palette, palette] = paletteSelector('primary');

	return (
		<>
			<Portal mount={props.mount}>
				<Palette />
			</Portal>

			<Result.Root layout="vertical" title="page not found" palette={palette()} illustration={<Amico.Error404 />} />
		</>
	);
}
