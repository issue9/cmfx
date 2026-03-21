// SPDX-FileCopyrightText: 2024-2026 caixw
//
// SPDX-License-Identifier: MIT

import { Form, type MountProps, Numeric, Pagination } from '@cmfx/components';
import { createSignal, type JSX } from 'solid-js';
import { Portal } from 'solid-js/web';

import { paletteSelector } from '@docs/components/base';

export default function (props: MountProps): JSX.Element {
	const [Palette, palette] = paletteSelector();
	const [page, setPage] = createSignal('');
	const span = Form.fieldAccessor('spans', 3);

	return (
		<>
			<Portal mount={props.mount}>
				<Palette />
				<Numeric.Root class="w-20" accessor={span} />
			</Portal>

			<Pagination.Root
				palette={palette()}
				count={10}
				value={5}
				spans={span.getValue()}
				onChange={(val, old) => {
					return setPage(`new:${val}, old:${old}`);
				}}
			/>
			<pre>{page()}</pre>
		</>
	);
}
