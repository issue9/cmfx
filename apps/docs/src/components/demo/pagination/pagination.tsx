// SPDX-FileCopyrightText: 2024-2026 caixw
//
// SPDX-License-Identifier: MIT

import { type MountProps, Pagination } from '@cmfx/components';
import { createSignal, type JSX } from 'solid-js';
import { Portal } from 'solid-js/web';

import { numeric, paletteSelector } from '@docs/components/base';

export default function (props: MountProps): JSX.Element {
	const [Palette, palette] = paletteSelector();
	const [page, setPage] = createSignal('');
	const [Num, num] = numeric('span', 3);

	return (
		<>
			<Portal mount={props.mount}>
				<Palette />
				<Num />
			</Portal>

			<Pagination
				palette={palette()}
				count={10}
				value={5}
				spans={num()}
				onChange={(val, old) => {
					return setPage(`new:${val}, old:${old}`);
				}}
			/>
			<pre>{page()}</pre>
		</>
	);
}
