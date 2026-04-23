// SPDX-FileCopyrightText: 2026 caixw
//
// SPDX-License-Identifier: MIT

import type { Editor } from '@tiptap/core';
//import { BubbleMenuPlugin } from '@tiptap/extension-bubble-menu';
import { type JSX, onMount } from 'solid-js';
import IconCodeBlock from '~icons/material-symbols/code-blocks-outline-rounded';
import IconCode from '~icons/material-symbols/code-xml-rounded';
import IconBold from '~icons/material-symbols/format-bold-rounded';
import IconItalic from '~icons/material-symbols/format-italic-rounded';
import IconBlockQuote from '~icons/material-symbols/format-quote-rounded';
import IconUnderline from '~icons/material-symbols/format-underlined-rounded';
import IconStrike from '~icons/material-symbols/strikethrough-s-rounded';
import IconSubscript from '~icons/material-symbols/subscript-rounded';
import IconSuperscript from '~icons/material-symbols/superscript-rounded';

import { Divider } from '@components/divider';
import { AlignCenter, AlignJustify, AlignLeft, AlignRight } from './align';
import { Heading } from './heading';
import { Link } from './link';
import { List } from './list';
import styles from './style.module.css';
import { BackgroundColor, Color, LineHeight } from './textstyle';
import { ToggleButton } from './toggle';

export interface ToolbarProps {
	editor: Editor;
}

export function Toolbar(props: ToolbarProps): JSX.Element {
	let ref!: HTMLElement;

	onMount(() => {
		/*
		props.editor.registerPlugin(
			BubbleMenuPlugin({
				editor: props.editor,
				element: ref,
				pluginKey: 'bubble-menu',
				options: {
					strategy: 'fixed',
					placement: 'top',
				},
			}),
		);
		*/
	});

	return (
		<header ref={el => (ref = el)} class={styles.toolbar}>
			<Heading editor={props.editor} />
			<List editor={props.editor} />
			<ToggleButton
				isActive={() => props.editor.isActive('blockquote')}
				editor={props.editor}
				toggle={() => props.editor.chain().focus().toggleBlockquote().run()}
			>
				<IconBlockQuote />
			</ToggleButton>
			<ToggleButton
				isActive={() => props.editor.isActive('codeBlock')}
				editor={props.editor}
				toggle={() => props.editor.chain().focus().toggleCodeBlock().run()}
			>
				<IconCodeBlock />
			</ToggleButton>

			<Divider.Root layout="vertical" />

			<ToggleButton
				isActive={() => props.editor.isActive('bold')}
				editor={props.editor}
				toggle={() => props.editor.chain().focus().toggleBold().run()}
			>
				<IconBold />
			</ToggleButton>

			<ToggleButton
				isActive={() => props.editor.isActive('italic')}
				editor={props.editor}
				toggle={() => props.editor.chain().focus().toggleItalic().run()}
			>
				<IconItalic />
			</ToggleButton>

			<ToggleButton
				isActive={() => props.editor.isActive('strike')}
				editor={props.editor}
				toggle={() => props.editor.chain().focus().toggleStrike().run()}
			>
				<IconStrike />
			</ToggleButton>

			<ToggleButton
				isActive={() => props.editor.isActive('code')}
				editor={props.editor}
				toggle={() => props.editor.chain().focus().toggleCode().run()}
			>
				<IconCode />
			</ToggleButton>

			<ToggleButton
				isActive={() => props.editor.isActive('underline')}
				editor={props.editor}
				toggle={() => props.editor.chain().focus().toggleUnderline().run()}
			>
				<IconUnderline />
			</ToggleButton>

			<Link editor={props.editor} />

			<Divider.Root layout="vertical" />

			<ToggleButton
				isActive={() => props.editor.isActive('superscript')}
				editor={props.editor}
				toggle={() => props.editor.chain().focus().toggleSuperscript().run()}
			>
				<IconSuperscript />
			</ToggleButton>

			<ToggleButton
				isActive={() => props.editor.isActive('subscript')}
				editor={props.editor}
				toggle={() => props.editor.chain().focus().toggleSubscript().run()}
			>
				<IconSubscript />
			</ToggleButton>

			<Divider.Root layout="vertical" />

			<Color editor={props.editor} />
			<BackgroundColor editor={props.editor} />
			<LineHeight editor={props.editor} />

			<Divider.Root layout="vertical" />
			<AlignLeft editor={props.editor} />
			<AlignCenter editor={props.editor} />
			<AlignRight editor={props.editor} />
			<AlignJustify editor={props.editor} />
		</header>
	);
}
