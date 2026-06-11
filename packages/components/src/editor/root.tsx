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

import type { BaseProps, BaseRef, RefProps, ValueProps } from '@components/base';
import { joinClass, style2String } from '@components/base';
import { Form } from '@components/form';
import styles from './style.module.css';
import { Toolbar } from './toolbar';

export interface EditorRef extends BaseRef<HTMLDivElement> {
	/**
	 * 向外暴露的 {@link Editor} 对象
	 */
	editor(): Editor;
}

export interface EditorProps
	extends Omit<Form.DataProps, 'rounded'>,
		ValueProps<string>,
		BaseProps,
		RefProps<EditorRef> {
	placeholder?: string;
}

/**
 * WYSIWYG 编辑器
 */
export function EditorComponent(props: EditorProps): JSX.Element {
	const field = Form.useField<string>(props, true);
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
			class={joinClass(props.palette, styles.editor, field.class, props.class)}
			style={style2String(field.style, props.style)}
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
