// SPDX-FileCopyrightText: 2026 caixw
//
// SPDX-License-Identifier: MIT

import { createSignal, type JSX } from 'solid-js';
import IconCancel from '~icons/material-symbols/cancel-rounded';
import IconOK from '~icons/material-symbols/check-circle-unread-outline-rounded';
import IconClear from '~icons/material-symbols/delete';
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
	const [href, setHref] = createSignal('');
	let dialogRef: Dialog.RootRef;

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
					<Input.Root value={href()} onChange={v => setHref(v ?? '')} />
					<Button.Root
						square
						kind="flat"
						palette="primary"
						onclick={() => {
							dialogRef.root().returnValue = 'ok';
							dialogRef.root().close();
							props.editor.chain().focus().toggleLink({ href: href() }).run();
						}}
					>
						<IconOK />
					</Button.Root>

					<Button.Root
						square
						kind="flat"
						palette="error"
						onclick={() => {
							dialogRef.root().returnValue = 'clear';
							dialogRef.root().close();
							setHref('');
							props.editor.chain().focus().toggleLink({ href: '' }).run();
						}}
					>
						<IconClear />
					</Button.Root>

					<Divider.Root layout="vertical" />

					<Button.Root
						square
						kind="flat"
						palette="error"
						onclick={() => {
							dialogRef.root().returnValue = 'cancel';
							dialogRef.root().close();
						}}
					>
						<IconCancel />
					</Button.Root>

					<Button.Root square kind="flat" disabled={!href()} onclick={() => window.open(href())}>
						<IconVisit class="-scale-x-100" />
					</Button.Root>
				</div>
			</Dialog.Root>
		</>
	);
}
