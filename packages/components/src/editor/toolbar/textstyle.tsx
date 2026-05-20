// SPDX-FileCopyrightText: 2026 caixw
//
// SPDX-License-Identifier: MIT

import { createEffect, createSignal, type JSX, on, onCleanup, onMount } from 'solid-js';
import IconClose from '~icons/material-symbols/cancel-rounded';
import IconColor from '~icons/material-symbols/colors-rounded';
import IconLineHeight from '~icons/material-symbols/fit-page-height-outline-rounded';
import IconBackgroundColor from '~icons/material-symbols/format-color-fill-rounded';

import { Button } from '@components/button';
import { Color as XColor } from '@components/color';
import { useLocale } from '@components/context';
import { Dialog } from '@components/dialog';
import { InputNumber } from '@components/input';
import styles from './style.module.css';
import type { Props } from './types';

/**
 * 指定文本的颜色
 *
 * https://tiptap.dev/docs/editor/extensions/functionality/color
 */
export function Color(props: Props): JSX.Element {
	const l = useLocale();

	const [val, setVal] = createSignal<string | undefined>('color', props.editor.getAttributes('textStyle').color);
	let isSelectUpdate = false; // 是否来自 selectionUpdate 事件，如果是来自该事件，不需要执行 setColor 操作

	createEffect(
		on(val, v => {
			if (isSelectUpdate) {
				isSelectUpdate = false;
				return;
			}

			if (v) {
				props.editor.chain().setColor(v).run();
			} else {
				props.editor.chain().unsetColor().run();
			}
		}),
	);

	const selectionUpdate = () => {
		const color = props.editor.getAttributes('textStyle').color;
		if (val() === color) {
			return;
		}

		isSelectUpdate = true;
		setVal(color);
	};
	onMount(() => props.editor.on('selectionUpdate', selectionUpdate));
	onCleanup(() => props.editor.off('selectionUpdate', selectionUpdate));

	let picker: XColor.RootRef<true>;
	return (
		<Button.Root
			title={l.t('_c.editor.textColor')}
			square
			kind="flat"
			class={styles.item}
			checked={!!val()}
			onclick={e => {
				if (e.currentTarget === e.target) {
					picker.showPanel();
				}
			}}
		>
			<XColor.Root
				popover
				ref={el => (picker = el)}
				value={val()}
				spaces={[
					new XColor.TailwindVarsSpace(),
					new XColor.HSLSpace(),
					new XColor.OKLCHSpace(),
					new XColor.RGBSpace(),
					new XColor.WebSafeSpace(),
				]}
				activatorClass={styles['color-activator']}
				onChange={v => setVal(v)}
			>
				<IconColor />
			</XColor.Root>
		</Button.Root>
	);
}

/**
 * 指定背景色
 *
 * https://tiptap.dev/docs/editor/extensions/functionality/background-color
 */
export function BackgroundColor(props: Props): JSX.Element {
	const l = useLocale();

	const [val, setVal] = createSignal<string | undefined>(props.editor.getAttributes('textStyle').backgroundColor);

	let isSelectUpdate = false; // 是否来自 selectionUpdate 事件，如果是来自该事件，不需要执行 setColor 操作

	createEffect(
		on(val, v => {
			if (isSelectUpdate) {
				isSelectUpdate = false;
				return;
			}

			if (v) {
				props.editor.chain().setBackgroundColor(v).run();
			} else {
				props.editor.chain().unsetBackgroundColor().run();
			}
		}),
	);

	const selectionUpdate = () => {
		const color = props.editor.getAttributes('textStyle').backgroundColor;
		if (val() === color) {
			return;
		}

		isSelectUpdate = true;
		setVal(color);
	};
	onMount(() => props.editor.on('selectionUpdate', selectionUpdate));
	onCleanup(() => props.editor.off('selectionUpdate', selectionUpdate));

	let picker: XColor.RootRef<true>;
	return (
		<Button.Root
			title={l.t('_c.editor.backgroundColor')}
			square
			kind="flat"
			class={styles.item}
			checked={!!val()}
			onclick={e => {
				if (e.currentTarget === e.target) {
					picker.showPanel();
				}
			}}
		>
			<XColor.Root
				popover
				ref={el => (picker = el)}
				value={val()}
				onChange={v => setVal(v)}
				spaces={[
					new XColor.TailwindVarsSpace(),
					new XColor.HSLSpace(),
					new XColor.OKLCHSpace(),
					new XColor.RGBSpace(),
					new XColor.WebSafeSpace(),
				]}
				activatorClass={styles['color-activator']}
			>
				<IconBackgroundColor />
			</XColor.Root>
		</Button.Root>
	);
}

/**
 * 指定行高
 *
 * https://tiptap.dev/docs/editor/extensions/functionality/line-height
 */
export function LineHeight(props: Props): JSX.Element {
	const l = useLocale();

	const lh = props.editor.getAttributes('textStyle').lineHeight;
	const [height, setHeight] = createSignal<number | undefined>(lh ? parseFloat(lh) : undefined);
	createEffect(
		on(height, v => {
			if (v) {
				props.editor.chain().setLineHeight(v.toString()).run();
			} else {
				props.editor.chain().unsetLineHeight().run();
			}
		}),
	);

	const selectionUpdate = () => {
		const lh = props.editor.getAttributes('textStyle').lineHeight;
		const h = lh ? parseFloat(lh) : undefined;
		if (height() === h) {
			return;
		}
		setHeight(h);
	};
	onMount(() => props.editor.on('selectionUpdate', selectionUpdate));
	onCleanup(() => props.editor.off('selectionUpdate', selectionUpdate));

	let dialogRef: Dialog.RootRef;
	return (
		<>
			<Button.Root
				title={l.t('_c.editor.lineHeight')}
				square
				kind="flat"
				class={styles.item}
				checked={!!height()}
				onclick={() => dialogRef.root().showModal()}
			>
				<IconLineHeight />
			</Button.Root>

			<Dialog.Root ref={el => (dialogRef = el)} mainClass={styles['line-height']}>
				<InputNumber.Root class="flex-1" value={height()} onChange={v => setHeight(v)} />
				<Button.Root
					square
					kind="flat"
					palette="error"
					title={l.t('_c.close')}
					onclick={() => dialogRef.root().close('close')}
				>
					<IconClose />
				</Button.Root>
			</Dialog.Root>
		</>
	);
}
