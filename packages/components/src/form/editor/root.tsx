// SPDX-FileCopyrightText: 2024-2026 caixw
//
// SPDX-License-Identifier: MIT

import { Editor } from '@tiptap/core';
import { Subscript } from '@tiptap/extension-subscript';
import { Superscript } from '@tiptap/extension-superscript';
import { TextAlign } from '@tiptap/extension-text-align';
import { TextStyleKit } from '@tiptap/extension-text-style';
import StarterKit from '@tiptap/starter-kit';
import { createEffect, createMemo, type JSX, mergeProps, onCleanup, onMount, Show } from 'solid-js';

import { type BaseRef, joinClass, type RefProps } from '@components/base';
import { Form } from '@components/form/form';
import styles from './style.module.css';
import { Toolbar } from './toolbar';

export interface Ref extends BaseRef<HTMLDivElement> {
	/**
	 * 向外暴露的 {@link Editor} 对象
	 */
	editor(): Editor;
}

export interface Props extends Omit<Form.FieldBaseProps, 'rounded'>, RefProps<Ref> {
	placeholder?: string;

	/**
	 * NOTE: 非响应式属性
	 */
	accessor: Form.Accessor<string>;
}

/**
 * WYSIWYG 编辑器
 */
export function Root(props: Props): JSX.Element {
	const form = Form.useForm();
	props = mergeProps(form, props);

	let ref: HTMLDivElement;

	const editor = new Editor({
		extensions: [
			StarterKit,
			TextStyleKit,
			TextAlign.configure({
				types: ['heading', 'paragraph'],
			}),
			Superscript,
			Subscript,
		],
		content: props.accessor.getValue(),
		autofocus: true,
		editable: true,
		injectCSS: false,
	});

	onMount(() => {
		editor.mount({ mount: ref });

		editor.on('update', () => {
			props.accessor.setValue(editor.getHTML());
		});
	});

	onCleanup(() => editor.destroy());

	createEffect(() => {
		const v = props.accessor.getValue();
		editor.chain().setContent(v);
	});

	const areas = createMemo(() => Form.calcLayoutFieldAreas(props.layout!, props.hasHelp, !!props.label));
	return (
		<Form.Field
			class={joinClass(undefined, styles.editor, props.class)}
			style={props.style}
			title={props.title}
			palette={props.palette}
			ref={el => {
				if (!props.ref) {
					return;
				}
				props.ref({
					root: () => el,
					editor: () => editor,
				});
			}}
		>
			<Show when={areas().labelArea}>
				{area => (
					// biome-ignore lint/a11y/useKeyWithClickEvents: onclick
					// biome-ignore lint/a11y/noStaticElementInteractions: nostatic
					<span
						style={{
							...Form.fieldArea2Style(area()),
							width: props.labelWidth,
							'text-align': props.labelAlign,
							cursor: 'default',
						}}
						onClick={() => editor.chain().focus()}
					>
						{props.label}
					</span>
				)}
			</Show>

			<div class={styles['editor-wrap']} style={Form.fieldArea2Style(areas().inputArea)}>
				<Toolbar editor={editor} />
				<div ref={el => (ref = el)} class={styles.container} />
			</div>

			<Show when={areas().helpArea}>
				{area => <Form.FieldHelpArea area={area()} getError={props.accessor.getError} help={props.help} />}
			</Show>
		</Form.Field>
	);
}
