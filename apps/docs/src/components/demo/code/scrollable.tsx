// SPDX-FileCopyrightText: 2025-2026 caixw
//
// SPDX-License-Identifier: MIT

import { Code, MountProps } from '@cmfx/components';
import { JSX } from 'solid-js';
import { Portal } from 'solid-js/web';

import { boolSelector, paletteSelector } from '@docs/components/base';

export default function (props: MountProps): JSX.Element {
	const [Palette, palette] = paletteSelector();
	const [Editable, editable] = boolSelector('_d.demo.editable');
	const [Wrap, wrap] = boolSelector('_d.demo.wrap');

	return (
		<div>
			<Portal mount={props.mount}>
				<Palette />
				<Editable />
				<Wrap />
			</Portal>
			<Code editable={editable()} ln={0} wrap={wrap()} palette={palette()} class="h-50" lang="css">
				{`/*
 * SPDX-FileCopyrightText: 2025 caixw
 *
 * SPDX-License-Identifier: MIT
 */

@reference '../style.css';

@layer components {
    .code {
        @apply font-mono w-full h-full overflow-auto rounded-lg relative;
        @apply border border-palette-bg-low;

        .action {
            @apply flex justify-end absolute top-0 right-0;
        }
    }
}
`}
			</Code>
		</div>
	);
}
