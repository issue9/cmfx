// SPDX-FileCopyrightText: 2025-2026 caixw
//
// SPDX-License-Identifier: MIT

import { MountProps, Statistic } from '@cmfx/components';
import { JSX } from 'solid-js';
import { Portal } from 'solid-js/web';
import IconEye from '~icons/material-symbols/eyeglasses';

import { paletteSelector } from '@docs/components/base';

export default function (props: MountProps): JSX.Element {
	const [Palette, palette] = paletteSelector('primary');
	return (
		<div>
			<Portal mount={props.mount}>
				<Palette />
			</Portal>

			<div class="flex gap-2">
				<Statistic label="basic" palette={palette()} value={5} />
				<Statistic label="basic" palette={palette()} value={500} icon={<IconEye class="text-[1em]" />} />
				<Statistic
					label="basic"
					palette={palette()}
					value={5}
					icon={<IconEye class="text-[1em]" />}
					formatter={v => `${v}/5000`}
				/>
			</div>
		</div>
	);
}
