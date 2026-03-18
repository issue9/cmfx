// SPDX-FileCopyrightText: 2024-2026 caixw
//
// SPDX-License-Identifier: MIT

import { Button, Dialog, type MountProps, notify } from '@cmfx/components';
import type { JSX } from 'solid-js';
import { Portal } from 'solid-js/web';

import { paletteSelector } from '@docs/components/base';

export default function (props: MountProps): JSX.Element {
	const [Palette, palette] = paletteSelector();
	let dlg: Dialog.RootRef;

	return (
		<div>
			<Portal mount={props.mount}>
				<Palette />
			</Portal>

			<div>
				<Dialog.Root
					class="min-w-5"
					palette={palette()}
					header={
						<Dialog.Toolbar movable close min max>
							header
						</Dialog.Toolbar>
					}
					ref={el => {
						dlg = el;
						el.root().oncancel = async () => {
							await notify('cancel');
						};
						el.root().onclose = async () => {
							await notify('close');
						};
					}}
					footer={<Dialog.Actions />}
				>
					content
				</Dialog.Root>
				<Button.Root onclick={() => dlg.root().showModal()} palette={palette()}>
					show
				</Button.Root>
			</div>
		</div>
	);
}
