// SPDX-FileCopyrightText: 2026 caixw
//
// SPDX-License-Identifier: MIT

import type { Editor } from '@tiptap/core';
import { createSignal, type JSX, type ParentProps } from 'solid-js';

import { Button } from '@components/button';
import styles from './style.module.css';

interface ToggleButtonProps extends ParentProps {
	toggle: () => void;
	isActive: () => boolean;
	key: string;
	editor: Editor;
}

/**
 * 两种状态的切换按钮
 */
export function ToggleButton(props: ToggleButtonProps): JSX.Element {
	const [isActive, setIsActive] = createSignal(false);

	props.editor.on('transaction', () => {
		setIsActive(props.isActive());
	});

	return (
		<Button.Root class={styles.item} square kind="flat" checked={isActive()} onclick={() => props.toggle()}>
			{props.children}
		</Button.Root>
	);
}
