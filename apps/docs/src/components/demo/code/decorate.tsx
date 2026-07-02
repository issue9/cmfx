// SPDX-FileCopyrightText: 2025-2026 caixw
//
// SPDX-License-Identifier: MIT

import { Code, type MountProps } from '@cmfx/components';
import { createMemo, type JSX } from 'solid-js';
import { Portal } from 'solid-js/web';

import { arrayMultipleSelector, boolSelector, paletteSelector } from '@docs/components/base';

export default function (props: MountProps): JSX.Element {
	const [Palette, palette] = paletteSelector();
	const [Editable, editable] = boolSelector('_d.demo.editable');
	const [Decorate, decorate] = arrayMultipleSelector('装饰器', ['copy', 'border', 'toolbar']);

	const decorates = createMemo(() => {
		return decorate()?.map<Code.Decorate>(d => {
			switch (d) {
				case 'copy':
					return Code.copyButtonDecorate;
				case 'border':
					return Code.borderDecorate;
				case 'toolbar':
					return Code.toolbarDecorate;
				default:
					throw new Error(`无效的枚举值： ${d}`);
			}
		});
	});

	return (
		<div>
			<Portal mount={props.mount}>
				<Palette />
				<Editable />
				<Decorate />
			</Portal>
			<Code editable={editable()} ln={0} wrap palette={palette()} class="h-50" lang="css" decorates={decorates()}>
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
