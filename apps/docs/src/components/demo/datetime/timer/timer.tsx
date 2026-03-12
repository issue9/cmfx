// SPDX-FileCopyrightText: 2025-2026 caixw
//
// SPDX-License-Identifier: MIT

import { Button, MountProps, Timer } from '@cmfx/components';
import { createSignal, JSX } from 'solid-js';
import { Portal } from 'solid-js/web';
import IconFace from '~icons/material-symbols/face';

import { arraySelector, boolSelector } from '@docs/components/base';

export default function (props: MountProps): JSX.Element {
	const [Unit, unit] = boolSelector('unit');
	const [Field, field] = arraySelector('field', Timer.fields, 'minutes');
	const [msg, setMsg] = createSignal('');

	let ref: Timer.RootRef;

	return (
		<div>
			<Portal mount={props.mount}>
				<Unit />
				<Field />
			</Portal>

			<div class="flex flex-col gap-4">
				<div title="-1">
					<Timer.Root
						unit={unit()}
						ref={el => {
							ref = el;
						}}
						duration={'23m34s'}
						startField={field()}
						interval={-1}
					/>
					<Button.Root palette="primary" onclick={() => ref!.toggle()}>
						切换暂停和启动状态
					</Button.Root>
				</div>

				<div title="event:-1">
					<Timer.Root
						unit={unit()}
						onTick={() => setMsg('tick')}
						onComplete={() => setMsg('complete')}
						duration={'10s'}
						startField={field()}
						interval={-1}
						autoStart
					/>
					<div>{msg()}</div>
				</div>

				<div title="+1">
					<Timer.Root
						separator={<IconFace />}
						unit={unit()}
						duration={'23m34s'}
						startField={field()}
						interval={1}
						autoStart
					/>
				</div>
			</div>
		</div>
	);
}
