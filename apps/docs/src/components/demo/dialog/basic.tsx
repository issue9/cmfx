// SPDX-FileCopyrightText: 2024-2026 caixw
//
// SPDX-License-Identifier: MIT

import { Button, Dialog, DialogRef, MountProps } from '@cmfx/components';
import { JSX } from 'solid-js';
import { Portal } from 'solid-js/web';

import { paletteSelector } from '@docs/components/base';

export default function (props: MountProps): JSX.Element {
	const [Palette, palette] = paletteSelector();
	let dlg: DialogRef;

	return (
		<div>
			<Portal mount={props.mount}>
				<Palette />
			</Portal>

			<div>
				<Dialog
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
				</Dialog>
				<Button onclick={() => dlg.root().show()} palette={palette()}>
					show
				</Button>
			</div>
		</div>
	);
}
