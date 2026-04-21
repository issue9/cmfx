// SPDX-FileCopyrightText: 2026 caixw
//
// SPDX-License-Identifier: MIT

import { createSignal, type JSX, Show } from 'solid-js';
import IconClear from '~icons/material-symbols/cancel-rounded';
import IconOK from '~icons/material-symbols/check-circle-unread-outline-rounded';
import IconLink from '~icons/material-symbols/link-2-rounded';
import IconVisit from '~icons/material-symbols/pip-exit-outline-rounded';

import { Button } from '@components/button';
import { Dialog } from '@components/dialog';
import { Divider } from '@components/divider';
import { Input } from '@components/input';
import styles from './style.module.css';
import { ToggleButton } from './toggle';
import type { Props } from './types';

export function Link(props: Props): JSX.Element {
	let dialogRef: Dialog.RootRef;
	const [href, setHref] = createSignal(props.editor.getAttributes('link').href);

	return (
		<>
			<ToggleButton
				isActive={() => props.editor.isActive('link')}
				key="link"
				editor={props.editor}
				toggle={() => dialogRef.root().showModal()}
			>
				<IconLink />
			</ToggleButton>

			<Dialog.Root ref={el => (dialogRef = el)}>
				<div class={styles.link}>
					<Input.Root
						value={href()}
						onChange={v => setHref(v)}
						suffix={
							<Show when={href()}>
								<Button.Root class="p-1" square kind="flat" palette="error" onclick={() => setHref()}>
									<IconClear />
								</Button.Root>
							</Show>
						}
					/>
					<Button.Root
						square
						kind="flat"
						palette="primary"
						onclick={() => {
							dialogRef.root().close('ok');
							const h = href() || props.editor.getAttributes('link').href;
							if (h) {
								props.editor.chain().focus().toggleLink({ href: h }).run();
							}
						}}
					>
						<IconOK />
					</Button.Root>

					<Divider.Root layout="vertical" />

					<Button.Root
						square
						kind="flat"
						palette="error"
						onclick={() => {
							dialogRef.root().close('cancel');
						}}
					>
						<IconClear />
					</Button.Root>

					<Button.Root square kind="flat" disabled={!href()} onclick={() => window.open(href())}>
						<IconVisit class="-scale-x-100" />
					</Button.Root>
				</div>
			</Dialog.Root>
		</>
	);
}
