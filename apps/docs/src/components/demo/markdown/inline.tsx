// SPDX-FileCopyrightText: 2026 caixw
//
// SPDX-License-Identifier: MIT

import { Markdown, type MountProps } from '@cmfx/components';
import type { JSX } from 'solid-js';
import { Portal } from 'solid-js/web';
import IconFace from '~icons/material-symbols/face';
import IconPerson from '~icons/material-symbols/person';

import { paletteSelector } from '@docs/components/base';

export default function (props: MountProps): JSX.Element {
	const [Palette, palette] = paletteSelector();

	const text = '# inline组件\n\n## h2\n\n@`icon1`@@`icon2`@\n\n- icon1:@`icon1`@\n- icon2:@`icon2`@\n';

	return (
		<>
			<Portal mount={props.mount}>
				<Palette />
			</Portal>

			<Markdown.Root
				tag="div"
				palette={palette()}
				text={text}
				components={{ icon1: () => <IconFace />, icon2: () => <IconPerson /> }}
			/>
		</>
	);
}
