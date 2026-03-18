// SPDX-FileCopyrightText: 2024-2026 caixw
//
// SPDX-License-Identifier: MIT

import { Button, ButtonGroup, type MountProps } from '@cmfx/components';
import type { JSX } from 'solid-js';
import { Portal } from 'solid-js/web';
import IconFace from '~icons/material-symbols/face';

import { boolSelector, buttonKindSelector } from '@docs/components/base';

export default function (props: MountProps): JSX.Element {
	const [Kind, kind] = buttonKindSelector();
	const [Disabled, disabled] = boolSelector('_d.demo.disabled');
	const [Rounded, rounded] = boolSelector('_d.demo.rounded');

	return (
		<div>
			<Portal mount={props.mount}>
				<Kind />
				<Disabled />
				<Rounded />
			</Portal>

			<div class="flex flex-col gap-y-2">
				<Button.Root class="w-full" disabled={disabled()} rounded={rounded()} kind={kind()} palette="primary">
					block
				</Button.Root>

				<Button.Root class="w-full" disabled={disabled()} rounded={rounded()} kind={kind()} palette="primary">
					<IconFace />
					with icon
				</Button.Root>

				<ButtonGroup.Root class="w-full" rounded={rounded()} palette="primary" kind={kind()} disabled={disabled()}>
					<Button.Root>abc</Button.Root>
					<Button.Root>def</Button.Root>
					<Button.Root>hij</Button.Root>
					<Button.Root>klm</Button.Root>
				</ButtonGroup.Root>
			</div>
		</div>
	);
}
