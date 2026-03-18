// SPDX-FileCopyrightText: 2025-2026 caixw
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

			<Result.Root title="网站更新中" layout="auto" palette={palette()} illustration={<Amico.Error404 />}>
				<div>网站更新中......</div>
			</Result.Root>
		</>
	);
}
