// SPDX-FileCopyrightText: 2024-2026 caixw
//
// SPDX-License-Identifier: MIT

import { Button, Form, FormAPI, Dialog, MountProps, notify } from '@cmfx/components';
import { JSX } from 'solid-js';
import { Portal } from 'solid-js/web';

import { paletteSelector } from '@docs/components/base';

export default function (props: MountProps): JSX.Element {
	const [Palette, palette] = paletteSelector('primary');

	let dlg2: Dialog.RootRef;
	let dlg3: Dialog.RootRef;

	const api = new FormAPI({
		initValue: {},
		submit: async () => ({ ok: false, status: 500, body: { title: 'req error', type: 'err', status: 500 } }),
		onProblem: async p => await notify(p.title),
	});

	return (
		<div>
			<Portal mount={props.mount}>
				<Palette />
			</Portal>

			<Button.Root onclick={() => dlg2.root().showModal()} palette={palette()}>
				showModal
			</Button.Root>
			<Dialog.Root
				movable
				palette={palette()}
				ref={el => {
					dlg2 = el;
				}}
				header="header"
			>
				<div>
					<Form.Root inDialog api={api}>
						<div class="flex flex-col">
							<div class="py-3">form</div>
							<div class="flex">
								<Button.Root onclick={() => dlg3.root().showModal()}>show modal</Button.Root>
								<Button.Root
									ref={el => {
										el.root().value = 'submit';
									}}
									type="submit"
									class="me-8"
								>
									submit
								</Button.Root>
								<Button.Root
									ref={el => {
										el.root().value = 'reset';
									}}
									type="reset"
									class="me-8"
								>
									reset
								</Button.Root>
								<Button.Root
									ref={el => {
										el.root().value = 'button';
									}}
									type="button"
									onclick={() => {
										dlg2.move({ x: 8, y: 8 });
									}}
								>
									move(8,8)
								</Button.Root>
								<Button.Root
									ref={el => {
										el.root().value = 'button';
									}}
									type="button"
									onclick={() => {
										dlg2.move();
									}}
								>
									move to center
								</Button.Root>
								<Button.Root
									ref={el => {
										el.root().value = 'button';
									}}
									type="button"
								>
									button
								</Button.Root>
							</div>
						</div>
					</Form.Root>
				</div>
			</Dialog.Root>

			<Dialog.Root
				movable
				ref={el => {
					dlg3 = el;
				}}
				header="header"
			>
				<div>dialog 3</div>
			</Dialog.Root>
		</div>
	);
}
