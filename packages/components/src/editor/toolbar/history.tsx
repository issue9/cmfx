// SPDX-FileCopyrightText: 2026 caixw
//
// SPDX-License-Identifier: MIT

import { createSignal, type JSX, onCleanup, onMount } from 'solid-js';
import IconRedo from '~icons/material-symbols/redo-rounded';
import IconUndo from '~icons/material-symbols/undo-rounded';

import { Button } from '@components/button';
import { useLocale } from '@components/context';
import styles from './style.module.css';
import type { Props } from './types';

// https://tiptap.dev/docs/editor/extensions/functionality/undo-redo

export function Redo(props: Props): JSX.Element {
	const l = useLocale();
	const [disabled, setDisabled] = createSignal<boolean>(!props.editor.can().redo());

	const update = () => setDisabled(!props.editor.can().redo());
	onMount(() => props.editor.on('update', update));
	onCleanup(() => props.editor.off('update', update));

	return (
		<Button
			title={l.t('_c.editor.redo')}
			square
			kind="flat"
			class={styles.item}
			disabled={disabled()}
			onclick={() => props.editor.chain().focus().redo().run()}
		>
			<IconRedo />
		</Button>
	);
}

export function Undo(props: Props): JSX.Element {
	const l = useLocale();
	const [disabled, setDisabled] = createSignal<boolean>(!props.editor.can().undo());

	const update = () => setDisabled(!props.editor.can().undo());
	onMount(() => props.editor.on('update', update));
	onCleanup(() => props.editor.off('update', update));

	return (
		<Button
			title={l.t('_c.editor.undo')}
			square
			kind="flat"
			class={styles.item}
			disabled={disabled()}
			onclick={() => props.editor.chain().focus().undo().run()}
		>
			<IconUndo />
		</Button>
	);
}
