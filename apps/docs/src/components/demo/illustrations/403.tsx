// SPDX-FileCopyrightText: 2025-2026 caixw
//
// SPDX-License-Identifier: MIT

import type { MountProps } from '@cmfx/components';
import { Error403, galleries } from '@cmfx/illustrations';
import type { JSX } from 'solid-js';
import { Portal } from 'solid-js/web';

import { arraySelector, boolSelector, paletteSelector } from '@docs/components/base';

export default function (props: MountProps): JSX.Element {
	const [Palette, palette] = paletteSelector();
	const [Custom, custom] = boolSelector('自定义错误信息', false);
	const [Gallery, gallery] = arraySelector('选择集', galleries, 'amico');

	return (
		<>
			<Portal mount={props.mount}>
				<Palette />
				<Custom />
				<Gallery />
			</Portal>

			<Error403
				gallery={gallery()}
				class="aspect-square w-full"
				palette={palette()}
				text={custom() ? '自定义错误信息' : undefined}
			/>
		</>
	);
}
