// SPDX-FileCopyrightText: 2025-2026 caixw
//
// SPDX-License-Identifier: MIT

import type { MountProps } from '@cmfx/cdk';
import { Appbar, Button, useOptions } from '@cmfx/components';
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

			<Appbar
				brand={<Appbar.Brand title={opt.title} href="/" logo={opt.logo} />}
				palette={palette()}
				actions={
					<>
						<Button square>
							<IconEye />
						</Button>
						<Button square>
							<IconEye />
						</Button>
					</>
				}
			>
				<IconEye />
			</Appbar>
		</>
	);
}
