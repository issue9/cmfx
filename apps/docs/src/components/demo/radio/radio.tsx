// SPDX-FileCopyrightText: 2024-2026 caixw
//
// SPDX-License-Identifier: MIT

import type { MountProps } from '@cmfx/cdk';
import { Radio } from '@cmfx/components';
import type { JSX } from 'solid-js';
import { Portal } from 'solid-js/web';

import { boolSelector, stateSelector } from '@docs/components/base';

export default function (props: MountProps): JSX.Element {
	const [Rounded, rounded] = boolSelector('_d.demo.rounded');
	const [Block, block] = boolSelector('_d.demo.block');
	const [State, state] = stateSelector();

	return (
		<>
			<Portal mount={props.mount}>
				<State />
				<Rounded />
				<Block />
			</Portal>

			<div>
				<input
					type="radio"
					name="radio1"
					value="option1"
					tabindex={0}
					readonly={state() === 'readonly'}
					disabled={state() === 'disabled'}
				/>
				<input
					type="radio"
					name="radio1"
					value="option2"
					tabindex={0}
					readonly={state() === 'readonly'}
					disabled={state() === 'disabled'}
				/>
				<Radio
					name="radio1"
					label="Radio"
					block={block()}
					tabindex={0}
					rounded={rounded()}
					value="option3"
					state={state()}
				/>
			</div>
		</>
	);
}
