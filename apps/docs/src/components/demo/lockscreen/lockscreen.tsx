// SPDX-FileCopyrightText: 2026 caixw
//
// SPDX-License-Identifier: MIT

import { Button, LockScreen, type MountProps, Notify, useOptions } from '@cmfx/components';
import type { JSX } from 'solid-js';
import { Portal } from 'solid-js/web';

import { paletteSelector } from '@docs/components/base';

export default function (props: MountProps): JSX.Element {
	const [Palette, palette] = paletteSelector();
	const [, opt] = useOptions();
	let ref: LockScreen.Ref;

	return (
		<>
			<Portal mount={props.mount}>
				<Palette />
			</Portal>

			<LockScreen
				ref={el => (ref = el)}
				palette={palette()}
				class="h-100 w-100 bg-red-500"
				avatar={opt.logo}
				name="admin"
				logout={() => Notify.info('logout')}
			>
				<Button onclick={() => ref.lock()}>lock</Button>
			</LockScreen>
		</>
	);
}
