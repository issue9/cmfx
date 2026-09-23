// SPDX-FileCopyrightText: 2024-2026 caixw
//
// SPDX-License-Identifier: MIT

import type { MountProps } from '@cmfx/cdk';
import { InputPassword } from '@cmfx/components';
import { createSignal, type JSX } from 'solid-js';
import { Portal } from 'solid-js/web';
import IconFace from '~icons/material-symbols/face';

import { boolSelector, paletteSelector, stateSelector } from '@docs/components/base';

export default function (props: MountProps): JSX.Element {
	const [pwd] = createSignal('pwd');

	const [Palette, palette] = paletteSelector();
	const [Rounded, rounded] = boolSelector('_d.demo.rounded', false);
	const [State, state] = stateSelector();
	const [Count, count] = boolSelector('_d.demo.charCount', false);

	return (
		<div>
			<Portal mount={props.mount}>
				<Palette />
				<Rounded />
				<State />
				<Count />
			</Portal>

			<InputPassword
				count={count()}
				placeholder="placeholder"
				prefix={<IconFace class="self-center" />}
				palette={palette()}
				rounded={rounded()}
				state={state()}
				value={pwd()}
			/>
		</div>
	);
}
