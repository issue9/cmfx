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

	const Content = (): JSX.Element => {
		const ctx = LockScreen.use();
		return (
			<div class="h-100 w-100 bg-palette-bg">
				<Button onclick={() => ctx.lock()}>lock</Button>
			</div>
		);
	};

	return (
		<>
			<Portal mount={props.mount}>
				<Palette />
			</Portal>

			<LockScreen palette={palette()} avatar={opt.logo} name='admin' logout={() => Notify.info('logout')}>
				<Content />
			</LockScreen>
		</>
	);
}
