// SPDX-FileCopyrightText: 2024-2026 caixw
//
// SPDX-License-Identifier: MIT

import { Button, Dialog, MountProps } from '@cmfx/components';
import { JSX } from 'solid-js';
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
					movable
					palette={palette()}
					header="header"
					ref={el => {
						dlg = el;
					}}
					actions={
						<>
							<button value="submit" type="submit" class="me-8">
								submit
							</button>
							<button value="reset" type="reset" class="me-8">
								reset
							</button>
							<button value="button" type="button" onClick={() => dlg.root().close('close')}>
								close
							</button>
						</>
					}
				>
					content
				</Dialog.Root>
				<Button.Root onclick={() => dlg.root().show()} palette={palette()}>
					show
				</Button.Root>
			</div>
		</div>
	);
}
