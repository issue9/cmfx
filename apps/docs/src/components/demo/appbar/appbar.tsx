// SPDX-FileCopyrightText: 2025-2026 caixw
//
// SPDX-License-Identifier: MIT

import { Appbar, Button, MountProps, useOptions } from '@cmfx/components';
import { Portal } from 'solid-js/web';
import IconEye from '~icons/material-symbols/eyeglasses';

import { paletteSelector } from '@docs/components/base';

export default function (props: MountProps) {
	const [, origin] = useOptions();
	const [Palette, palette] = paletteSelector();

	return (
		<>
			<Portal mount={props.mount}>
				<Palette />
			</Portal>

			<Appbar.Root
				palette={palette()}
				title="这个公司的名称有一点点长哦！"
				logo={<Appbar.Image src={origin.logo} />}
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
