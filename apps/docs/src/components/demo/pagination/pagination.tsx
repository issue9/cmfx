// SPDX-FileCopyrightText: 2024-2026 caixw
//
// SPDX-License-Identifier: MIT

import { fieldAccessor, MountProps, Numeric, Pagination } from '@cmfx/components';
import { createSignal, JSX } from 'solid-js';
import { Portal } from 'solid-js/web';

import { paletteSelector } from '@docs/components/base';

export default function (props: MountProps): JSX.Element {
	const [Palette, palette] = paletteSelector();
	const [page, setPage] = createSignal('');
	const span = fieldAccessor('spans', 3);

	return (
		<>
			<Portal mount={props.mount}>
				<Palette />
				<Numeric class="w-20" accessor={span} />
			</Portal>

			<Pagination
				palette={palette()}
				count={10}
				initValue={5}
				spans={span.getValue()}
				onChange={(val, old) => {
					return setPage(`new:${val}, old:${old}`);
				}}
			/>
			<pre>{page()}</pre>
		</>
	);
}
