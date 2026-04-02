// SPDX-FileCopyrightText: 2026 caixw
//
// SPDX-License-Identifier: MIT

import { Markdown, type MountProps } from '@cmfx/components';
import type { JSX } from 'solid-js';
import { Portal } from 'solid-js/web';

import { paletteSelector } from '@docs/components/base';

export default function (props: MountProps): JSX.Element {
	const [Palette, palette] = paletteSelector();

	const text = '# h1\n\n## h2\n\nline1\nline2\n\n- item1\n- item2\n';

	return (
		<>
			<Portal mount={props.mount}>
				<Palette />
			</Portal>

			<Markdown.Root palette={palette()} text={text} />
		</>
	);
}
