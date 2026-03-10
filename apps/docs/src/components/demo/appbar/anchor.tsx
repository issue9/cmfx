// SPDX-FileCopyrightText: 2025-2026 caixw
//
// SPDX-License-Identifier: MIT

import { Appbar, Button, MountProps, useOptions } from '@cmfx/components';
import { Portal } from 'solid-js/web';
import IconEye from '~icons/material-symbols/eyeglasses';

import { paletteSelector } from '@docs/components/base';

export default function (props: MountProps) {
	const [, opt] = useOptions();
	const [Palette, palette] = paletteSelector();

	return (
		<>
			<Portal mount={props.mount}>
				<Palette />
			</Portal>

			<Appbar.Root
				href="/"
				palette={palette()}
				title={opt.title}
				logo={<Appbar.Image src={opt.logo} />}
				actions={
					<>
						<Button.Root square>
							<IconEye />
						</Button.Root>
						<Button.Root square>
							<IconEye />
						</Button.Root>
					</>
				}
			>
				<IconEye />
			</Appbar.Root>
		</>
	);
}
