// SPDX-FileCopyrightText: 2025-2026 caixw
//
// SPDX-License-Identifier: MIT

import { Button, MountProps, Stepper } from '@cmfx/components';
import { JSX } from 'solid-js';
import { Portal } from 'solid-js/web';
import IconChat from '~icons/material-symbols/chat';
import IconCheck from '~icons/material-symbols/check';
import IconPerson from '~icons/material-symbols/person';

import { layoutSelector, paletteSelector } from '@docs/components/base';

export default function (props: MountProps): JSX.Element {
	let ref1: Stepper.RootRef;
	let ref2: Stepper.RootRef;
	let ref3: Stepper.RootRef;

	const [Palette, palette] = paletteSelector('surface');
	const [Layout, layout] = layoutSelector('_d.demo.componentLayout', 'horizontal');

	return (
		<>
			<Portal mount={props.mount}>
				<Palette />
				<Layout />
			</Portal>

			<div class="w-full">
				<p>icon=dot</p>
				<Stepper.Root
					layout={layout()}
					palette={palette()}
					ref={el => {
						ref1 = el;
					}}
					steps={[
						{ title: 'Step 1', content: 'Content for Step 1' },
						{ title: 'Step 2222222', content: 'Content for Step 2' },
						{ title: 'Step 3', content: 'Content for Step 3' },
					]}
				/>

				<Button.Root onclick={() => ref1.prev()}>prev</Button.Root>
				<Button.Root onclick={() => ref1.next()}>next</Button.Root>
			</div>

			<div class="w-full">
				<p>icon=icon</p>
				<Stepper.Root
					layout={layout()}
					palette={palette()}
					ref={el => {
						ref2 = el;
					}}
					steps={[
						{ title: 'Step 1', content: 'Content for Step 1', icon: <IconPerson /> },
						{ title: 'Step 2222222', content: 'Content for Step 2', icon: <IconChat /> },
						{ title: 'Step 3', content: 'Content for Step 3', icon: <IconCheck /> },
					]}
				/>

				<Button.Root onclick={() => ref2.prev()}>prev</Button.Root>
				<Button.Root onclick={() => ref2.next()}>next</Button.Root>
			</div>

			<div class="w-full">
				<p>w-full</p>
				<Stepper.Root
					layout={layout()}
					palette={palette()}
					ref={el => {
						ref3 = el;
					}}
					steps={[
						{ title: 'Step 1', content: 'Content for Step 1', icon: (c?: boolean) => (c ? <IconCheck /> : true) },
						{ title: 'Step 2', content: 'Content for Step 2', icon: (c?: boolean) => (c ? <IconCheck /> : true) },
						{ title: 'Step 3', content: 'Content for Step 3', icon: true },
					]}
				/>

				<Button.Root onclick={() => ref3.prev()}>prev</Button.Root>
				<Button.Root onclick={() => ref3.next()}>next</Button.Root>
			</div>
		</>
	);
}
