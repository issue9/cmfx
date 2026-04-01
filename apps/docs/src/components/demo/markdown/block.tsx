// SPDX-FileCopyrightText: 2026 caixw
//
// SPDX-License-Identifier: MIT

import { Button, Markdown, type MountProps, Notify } from '@cmfx/components';
import type { JSX } from 'solid-js';
import { Portal } from 'solid-js/web';
import IconFace from '~icons/material-symbols/face';

import { paletteSelector } from '@docs/components/base';

export default function (props: MountProps): JSX.Element {
	const [Palette, palette] = paletteSelector();

	const text = '# Block组件\n\n## h2\n\n$$$btn1$$$\n$$$btn2$$$\n\n$$$btn1$$$\n$$$btn2$$$\n\n';

	return (
		<>
			<Portal mount={props.mount}>
				<Palette />
			</Portal>

			<Markdown.Root
				palette={palette()}
				text={text}
				components={{
					btn1: () => (
						<Button.Root square onclick={() => Notify.success('click button')}>
							<IconFace />
						</Button.Root>
					),
					btn2: () => <Button.Root>btn</Button.Root>,
				}}
			/>
		</>
	);
}
