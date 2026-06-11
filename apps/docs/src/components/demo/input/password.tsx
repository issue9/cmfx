// SPDX-FileCopyrightText: 2024-2026 caixw
//
// SPDX-License-Identifier: MIT

import { InputPassword, type MountProps } from '@cmfx/components';
import { createSignal, type JSX } from 'solid-js';
import { Portal } from 'solid-js/web';
import IconFace from '~icons/material-symbols/face';

import { boolSelector, paletteSelector } from '@docs/components/base';

export default function (props: MountProps): JSX.Element {
	const [pwd] = createSignal('pwd');

	const [Palette, palette] = paletteSelector();
	const [Disabled, disabled] = boolSelector('_d.demo.disabled');
	const [Readonly, readonly] = boolSelector('_d.demo.readonly');
	const [Rounded, rounded] = boolSelector('_d.demo.rounded', false);
	const [Count, count] = boolSelector('_d.demo.charCount', false);

	return (
		<div>
			<Portal mount={props.mount}>
				<Palette />
				<Readonly />
				<Rounded />
				<Disabled />
				<Count />
			</Portal>

			<InputPassword
				count={count()}
				placeholder="placeholder"
				prefix={<IconFace class="self-center" />}
				palette={palette()}
				disabled={disabled()}
				rounded={rounded()}
				readonly={readonly()}
				value={pwd()}
			/>
		</div>
	);
}
