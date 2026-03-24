// SPDX-FileCopyrightText: 2024-2026 caixw
//
// SPDX-License-Identifier: MIT

import { Button, ButtonGroup, type MountProps, PrintButton } from '@cmfx/components';
import type { JSX } from 'solid-js';
import { Portal } from 'solid-js/web';
import IconClose from '~icons/material-symbols/close';
import IconFace from '~icons/material-symbols/face';
import IconSync from '~icons/material-symbols/sync';

import { boolSelector, buttonKindSelector } from '@docs/components/base';

export default function (props: MountProps): JSX.Element {
	const [Kind, kind] = buttonKindSelector();
	const [Disabled, disabled] = boolSelector('_d.demo.disabled');
	const [Rounded, rounded] = boolSelector('_d.demo.rounded');

	let ref: HTMLElement;

	return (
		<div>
			<Portal mount={props.mount}>
				<Kind />
				<Disabled />
				<Rounded />
			</Portal>

			<div class="flex flex-wrap items-center gap-2" ref={el => (ref = el)}>
				<ButtonGroup.Root rounded={rounded()} palette="primary" kind={kind()} disabled={disabled()}>
					<Button.Root checked>abc</Button.Root>
					<Button.Root>def</Button.Root>
					<Button.Root>hij</Button.Root>
				</ButtonGroup.Root>

				<ButtonGroup.Root layout="vertical" rounded={rounded()} palette="secondary" kind={kind()} disabled={disabled()}>
					<Button.Root>abc</Button.Root>
					<Button.Root>def</Button.Root>
					<Button.Root>hij</Button.Root>
				</ButtonGroup.Root>

				<ButtonGroup.Root rounded={rounded()} palette="tertiary" kind={kind()} disabled={disabled()}>
					<Button.Root square>
						<IconFace />
					</Button.Root>
					<PrintButton.Root element={() => ref} />
					<Button.Root square>
						<IconClose />
					</Button.Root>
					<Button.Root square>
						<IconSync />
					</Button.Root>
				</ButtonGroup.Root>

				<ButtonGroup.Root rounded={rounded()} palette="surface" kind={kind()} disabled={disabled()}>
					<Button.Root type="a" href=".">
						abc
					</Button.Root>
					<Button.Root type="a" href=".">
						def
					</Button.Root>
					<Button.Root type="a" href=".">
						hij
					</Button.Root>
				</ButtonGroup.Root>

				<ButtonGroup.Root rounded={rounded()} kind={kind()} disabled={disabled()}>
					<Button.Root type="a" square href="">
						<IconFace />
					</Button.Root>
					<Button.Root type="a" square href="">
						<IconClose />
					</Button.Root>
					<Button.Root type="a" square href="">
						<IconSync />
					</Button.Root>
				</ButtonGroup.Root>
			</div>
		</div>
	);
}
