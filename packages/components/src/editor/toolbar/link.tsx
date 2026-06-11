// SPDX-FileCopyrightText: 2026 caixw
//
// SPDX-License-Identifier: MIT

import { createSignal, type JSX, onCleanup, onMount, Show } from 'solid-js';
import IconClear from '~icons/material-symbols/cancel-rounded';
import IconOK from '~icons/material-symbols/check-circle-unread-outline-rounded';
import IconLink from '~icons/material-symbols/link-2-rounded';
import IconVisit from '~icons/material-symbols/pip-exit-outline-rounded';

import { Button } from '@components/button';
import { useLocale } from '@components/context';
import { Dialog } from '@components/dialog';
import { InputBase } from '@components/input';
import styles from './style.module.css';
import type { Props } from './types';

export function Link(props: Props): JSX.Element {
	const l = useLocale();
	let dialogRef: Dialog.Ref;
	const [href, setHref] = createSignal(props.editor.getAttributes('link').href);

	const transaction = () => setHref(props.editor.getAttributes('link').href);
	onMount(() => props.editor.on('transaction', transaction));
	onCleanup(() => props.editor.off('transaction', transaction));

	return (
		<>
			<Button
				title={l.t('_c.editor.link')}
				checked={href()}
				class={styles.item}
				square
				kind="flat"
				onclick={() => dialogRef.root().showModal()}
			>
				<IconLink />
			</Button>

			<Dialog ref={el => (dialogRef = el)} mainClass={styles.link}>
				<InputBase
					class="flex-1"
					value={href()}
					onChange={v => setHref(v)}
					suffix={
						<Show when={href()}>
							<Button
								title={l.t('_c.editor.clear')}
								class="p-1"
								square
								kind="flat"
								palette="error"
								onclick={() => setHref()}
							>
								<IconClear />
							</Button>
						</Show>
					}
				/>
				<Button
					square
					kind="flat"
					palette="primary"
					title={l.t('_c.ok')}
					onclick={() => {
						dialogRef.root().close('ok');
						const h = href() || props.editor.getAttributes('link').href;
						if (h && href() !== props.editor.getAttributes('link').href) {
							props.editor.chain().focus().toggleLink({ href: h }).run();
						}
					}}
				>
					<IconOK />
				</Button>

				<Button
					square
					kind="flat"
					palette="error"
					title={l.t('_c.cancel')}
					onclick={() => dialogRef.root().close('cancel')}
				>
					<IconClear />
				</Button>

				<Button
					title={l.t('_c.editor.visit')}
					square
					kind="flat"
					disabled={!href()}
					onclick={() => window.open(href())}
				>
					<IconVisit class="-scale-x-100" />
				</Button>
			</Dialog>
		</>
	);
}
