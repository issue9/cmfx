// SPDX-FileCopyrightText: 2025-2026 caixw
//
// SPDX-License-Identifier: MIT

import { Button, InputNumber, type MountProps, Tooltip } from '@cmfx/components';
import { createSignal, type JSX } from 'solid-js';
import { Portal } from 'solid-js/web';

import { posSelector } from '@docs/components/base';

export default function (props: MountProps): JSX.Element {
	const [timeout, setTimeout] = createSignal<number>(-1);
	const [Pos, pos] = posSelector();

	return (
		<>
			<Portal mount={props.mount}>
				<Pos />
				<InputNumber
					class="w-20"
					min={-1}
					max={5000}
					step={100}
					onChange={e => setTimeout(e ?? -1)}
					value={timeout()}
				/>
			</Portal>

			<Tooltip
				trigger="click"
				pos={pos()}
				duration={timeout()}
				tip={
					<>
						<p>tooltip</p>
						<p>
							line1
							<br />
							line2
						</p>
					</>
				}
			>
				<Button palette="primary">click</Button>
			</Tooltip>

			<Tooltip
				pos={pos()}
				duration={timeout()}
				tip={
					<>
						<p>tooltip</p>
						<p>
							line1
							<br />
							line2
						</p>
					</>
				}
			>
				<Button palette="secondary">hover</Button>
			</Tooltip>
		</>
	);
}
