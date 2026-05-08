// SPDX-FileCopyrightText: 2024-2026 caixw
//
// SPDX-License-Identifier: MIT

import { Editor } from '@tiptap/core';
import { Image } from '@tiptap/extension-image';
import { Subscript } from '@tiptap/extension-subscript';
import { Superscript } from '@tiptap/extension-superscript';
import { TextAlign } from '@tiptap/extension-text-align';
import { TextStyleKit } from '@tiptap/extension-text-style';
import { Placeholder } from '@tiptap/extensions';
import { StarterKit } from '@tiptap/starter-kit';
import { createEffect, type JSX, mergeProps, onCleanup, onMount } from 'solid-js';

import type { BaseProps, BaseRef, ChangeFunc, RefProps } from '@components/base';
import { Form } from '@components/form';
import styles from './style.module.css';
import { Toolbar } from './toolbar';

export interface Ref extends BaseRef<HTMLDivElement> {
	/**
	 * 向外暴露的 {@link Editor} 对象
	 */
	editor(): Editor;
}

export interface Props extends Omit<Form.InputProps, 'rounded'>, BaseProps, RefProps<Ref> {
	placeholder?: string;

	value?: string;

	onChange?: ChangeFunc<string | undefined>;
}

/**
 * WYSIWYG 编辑器
 */
export function Root(props: Props): JSX.Element {
	const field = Form.useField<string>() ?? Form.buildFakeFieldContext(props.value);
	const form = Form.useForm();
	props = mergeProps({ tabindex: 0 }, form, props);

	let containerRef: HTMLDivElement;

	let rootRef: HTMLDivElement;
	createEffect(() => (rootRef.ariaDisabled = props.disabled ? 'true' : 'false'));

	const editor = new Editor({
		extensions: [
			StarterKit,
			TextStyleKit,
			TextAlign.configure({
				types: ['heading', 'paragraph'],
			}),
			Superscript,
			Subscript,
			Image,
			Placeholder.configure({
				emptyNodeClass: styles.nodeEmpty,
				emptyEditorClass: styles.editorEmpty,
				placeholder: props.placeholder,
			}),
		],
		content: field.getValue(),
		autofocus: true,
		editable: true,
		injectCSS: false,
	});

	onMount(() => {
		editor.mount({ mount: containerRef });

		const update = () => field.setValue(editor.getHTML());
		editor.on('update', update);
		onCleanup(() => editor.off('update', update));
	});

	onCleanup(() => editor.destroy());

	createEffect(() => {
		const v = field.getValue();
		editor.chain().setContent(v ?? '');
	});

	return (
		<div
			class={styles.editor}
			ref={el => {
				rootRef = el;

				if (props.ref) {
					props.ref({
						root: () => el,
						editor: () => editor,
					});
				}
			}}
		>
			<Toolbar editor={editor} />
			<div ref={el => (containerRef = el)} class={styles.container} />
		</div>
	);
}
