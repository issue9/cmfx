// SPDX-FileCopyrightText: 2025-2026 caixw
//
// SPDX-License-Identifier: MIT

import { Button, Drawer, type MountProps } from '@cmfx/components';
import { createMemo, createSignal, type JSX, Show } from 'solid-js';
import { Portal } from 'solid-js/web';

import { arraySelector } from '@docs/components/base';

export default function (props: MountProps): JSX.Element {
	const [Breakpoint, breakpoint] = arraySelector(
		'breakpoint',
		['3xs', 'xs', 'sm', 'md', 'lg', '2xl', '4xl', '6xl', '8xl', 'true', 'false'],
		'lg',
	);
	const [Pos, pos] = arraySelector('pos', ['start', 'end'], 'start');

	const bp = createMemo(() => {
		const v = breakpoint();
		switch (v) {
			case 'true':
				return true;
			case 'false':
				return false;
			default:
				return v;
		}
	});

	const [ref, setRef] = createSignal<Drawer.RootRef>();

	return (
		<>
			<Portal mount={props.mount}>
				<Breakpoint />
				<Pos />
			</Portal>

			<Button.Root
				onclick={() => {
					ref()?.toggle();
				}}
			>
				ref.toggle
			</Button.Root>

			<Show when={ref()}>{r => <Drawer.ToggleButton drawer={r()} />}</Show>
			<Drawer.ToggleButton drawer={ref()} />

			<Drawer.Root
				ref={setRef}
				pos={pos()}
				palette="primary"
				initValue
				floating={bp()}
				main={
					<main class="h-full bg-secondary-bg">
						abc
						<br />
						<br />
						<br />
						<br />
						<br />
						<br />
						hij
					</main>
				}
			>
				<div class="h-full min-w-20 border-palette-border">
					aside
					<br />
				</div>
			</Drawer.Root>
		</>
	);
}
