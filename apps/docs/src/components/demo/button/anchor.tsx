// SPDX-FileCopyrightText: 2024-2026 caixw
//
// SPDX-License-Identifier: MIT

import { Button, MountProps } from '@cmfx/components';
import { JSX } from 'solid-js';
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

			<div class="flex flex-wrap items-center gap-2">
				<Button type="a" href="./" disabled={disabled()} rounded={rounded()} kind={kind()} palette="secondary">
					secondary
				</Button>
				<Button type="a" href="./" disabled={disabled()} rounded={rounded()} kind={kind()} palette="surface">
					surface
				</Button>
				<Button
					type="a"
					href="./"
					disabled={disabled()}
					rounded={rounded()}
					kind={kind()}
					palette="surface"
					onclick={() => alert('click1')}
				>
					click+href
				</Button>
				<Button type="a" href="./" disabled={disabled()} rounded={rounded()} kind={kind()}>
					undefined
				</Button>

				<Button type="a" href="./" disabled={disabled()} rounded={rounded()} kind={kind()} palette="tertiary" square>
					<IconFace />
				</Button>
				<Button type="a" href="./" disabled={disabled()} rounded={rounded()} kind={kind()} palette="primary">
					<IconFace class="me-1!" />
					with icon
				</Button>

				<Button rounded kind="fill" palette="tertiary">
					对比按钮
				</Button>
			</div>
		</div>
	);
}
