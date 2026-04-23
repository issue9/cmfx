// SPDX-FileCopyrightText: 2026 caixw
//
// SPDX-License-Identifier: MIT

import { type JSX, onCleanup, onMount } from 'solid-js';
import IconClear from '~icons/material-symbols/cancel-rounded';
import IconColor from '~icons/material-symbols/colors-rounded';
import IconLineHeight from '~icons/material-symbols/fit-page-height-outline-rounded';
import IconBackgroundColor from '~icons/material-symbols/format-color-fill-rounded';

import { Button } from '@components/button';
import { ColorPanel } from '@components/color';
import { useLocale } from '@components/context';
import { Dialog } from '@components/dialog';
import { ColorPicker } from '@components/form/color';
import { fieldAccessor } from '@components/form/form/access';
import { Numeric } from '@components/form/textfield';
import styles from './style.module.css';
import type { Props } from './types';

const pickers = [
	new ColorPanel.TailwindVarsPickerPanel(),
	new ColorPanel.HSLPickerPanel(),
	new ColorPanel.OKLCHPickerPanel(),
	new ColorPanel.PresetPickerPanel(),
	new ColorPanel.RGBPickerPanel(),
	new ColorPanel.WebSafePickerPanel(),
];

/**
 * 指定文本的颜色
 *
 * https://tiptap.dev/docs/editor/extensions/functionality/color
 */
export function Color(props: Props): JSX.Element {
	const l = useLocale();

	const accessor = fieldAccessor<string | undefined>('color', props.editor.getAttributes('textStyle').color);
	let isSelectUpdate = false; // 是否来自 selectionUpdate 事件，如果是来自该事件，不需要执行 setColor 操作
	accessor.onChange(v => {
		if (isSelectUpdate) {
			isSelectUpdate = false;
			return;
		}

		if (v) {
			props.editor.chain().setColor(v).run();
		} else {
			props.editor.chain().unsetColor().run();
		}
	});

	const selectionUpdate = () => {
		const color = props.editor.getAttributes('textStyle').color;
		if (accessor.getValue() === color) {
			return;
		}
		accessor.setValue(color);
	};
	onMount(() => props.editor.on('selectionUpdate', selectionUpdate));
	onCleanup(() => props.editor.off('selectionUpdate', selectionUpdate));

	let picker: ColorPicker.RootRef;
	return (
		<Button.Root
			title={l.t('_c.editor.textColor')}
			square
			kind="flat"
			class={styles.item}
			checked={!!accessor.getValue()}
			onclick={e => {
				if (e.currentTarget === e.target) {
					picker.showPicker();
				}
			}}
		>
			<ColorPicker.Root
				ref={el => (picker = el)}
				accessor={accessor}
				pickers={pickers}
				activatorClass={styles['color-activator']}
			>
				<IconColor />
			</ColorPicker.Root>
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

	const accessor = fieldAccessor<string | undefined>(
		'bgcolor',
		props.editor.getAttributes('textStyle').backgroundColor,
	);
	let isSelectUpdate = false; // 是否来自 selectionUpdate 事件，如果是来自该事件，不需要执行 setColor 操作
	accessor.onChange(v => {
		if (isSelectUpdate) {
			isSelectUpdate = false;
			return;
		}

		if (v) {
			props.editor.chain().setBackgroundColor(v).run();
		} else {
			props.editor.chain().unsetBackgroundColor().run();
		}
	});

	const selectionUpdate = () => {
		const color = props.editor.getAttributes('textStyle').backgroundColor;
		if (accessor.getValue() === color) {
			return;
		}
		accessor.setValue(color);
	};
	onMount(() => props.editor.on('selectionUpdate', selectionUpdate));
	onCleanup(() => props.editor.off('selectionUpdate', selectionUpdate));

	let picker: ColorPicker.RootRef;
	return (
		<Button.Root
			title={l.t('_c.editor.backgroundColor')}
			square
			kind="flat"
			class={styles.item}
			checked={!!accessor.getValue()}
			onclick={e => {
				if (e.currentTarget === e.target) {
					picker.showPicker();
				}
			}}
		>
			<ColorPicker.Root
				ref={el => (picker = el)}
				accessor={accessor}
				pickers={pickers}
				activatorClass={styles['color-activator']}
			>
				<IconBackgroundColor />
			</ColorPicker.Root>
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
	const accessor = fieldAccessor<number | undefined>('lineHeight', lh ? parseFloat(lh) : undefined);
	accessor.onChange(v => {
		// TODO
		if (v) {
			props.editor.chain().setLineHeight(v.toString()).run();
		} else {
			props.editor.chain().unsetLineHeight().run();
		}
	});

	const selectionUpdate = () => {
		const lh = props.editor.getAttributes('textStyle').lineHeight;
		const color = lh ? parseFloat(lh) : undefined;
		if (accessor.getValue() === color) {
			return;
		}
		accessor.setValue(color);
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
				checked={!!accessor.getValue()}
				onclick={() => dialogRef.root().showModal()}
			>
				<IconLineHeight />
			</Button.Root>

			<Dialog.Root ref={el => (dialogRef = el)} mainClass={styles['line-height']}>
				<Numeric.Root class="flex-1" accessor={accessor} />
				<Button.Root
					square
					kind="flat"
					palette="error"
					title={l.t('_c.close')}
					onclick={() => dialogRef.root().close('close')}
				>
					<IconClear />
				</Button.Root>
			</Dialog.Root>
		</>
	);
}
