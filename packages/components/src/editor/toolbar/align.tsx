// SPDX-FileCopyrightText: 2026 caixw
//
// SPDX-License-Identifier: MIT

import { createSignal, type JSX, onCleanup, onMount } from 'solid-js';
import IconAlign from '~icons/material-symbols/align-space-even-rounded';
import IconAlignCenter from '~icons/material-symbols/format-align-center-rounded';
import IconAlignJustify from '~icons/material-symbols/format-align-justify-rounded';
import IconAlignLeft from '~icons/material-symbols/format-align-left-rounded';
import IconAlignRight from '~icons/material-symbols/format-align-right-rounded';
import IconArrowDown from '~icons/material-symbols/keyboard-arrow-down-rounded';

import { Button } from '@components/button';
import { useLocale } from '@components/context';
import { Dropdown } from '@components/menu';
import styles from './style.module.css';
import type { Props } from './types';

const alignments = ['left', 'center', 'right', 'justify'] as const;

type Alignment = (typeof alignments)[number];

const icons: ReadonlyMap<Alignment, () => JSX.Element> = new Map([
	['left', () => <IconAlignLeft />],
	['center', () => <IconAlignCenter />],
	['right', () => <IconAlignRight />],
	['justify', () => <IconAlignJustify />],
]);

/**
 * 文本 Align 组件
 *
 * https://tiptap.dev/docs/editor/extensions/functionality/textalign
 */
export function Align(props: Props): JSX.Element {
	const l = useLocale();
	const [val, setVal] = createSignal<Alignment | undefined>();

	const transaction = () => {
		if (props.editor.isActive({ textAlign: 'left' })) {
			setVal('left');
		} else if (props.editor.isActive({ textAlign: 'right' })) {
			setVal('right');
		} else if (props.editor.isActive({ textAlign: 'center' })) {
			setVal('center');
		} else if (props.editor.isActive({ textAlign: 'justify' })) {
			setVal('justify');
		} else {
			setVal(undefined);
		}
	};
	onMount(() => props.editor.on('transaction', transaction));
	onCleanup(() => props.editor.off('transaction', transaction));

	return (
		<Dropdown
			value={val()}
			align="start"
			onChange={v => {
				if (v) {
					props.editor.chain().focus().toggleTextAlign(v).run();
				} else {
					props.editor.chain().focus().unsetTextAlign().run();
				}
			}}
			ref={el => el.trigger().classList.add(styles.item)}
			items={[
				{ type: 'item', value: 'left', prefix: icons.get('left')!(), label: l.t('_c.editor.alignLeft') },
				{ type: 'item', value: 'right', prefix: icons.get('right')!(), label: l.t('_c.editor.alignRight') },
				{ type: 'item', value: 'center', prefix: icons.get('center')!(), label: l.t('_c.editor.alignCenter') },
				{ type: 'item', value: 'justify', prefix: icons.get('justify')!(), label: l.t('_c.editor.alignJustify') },
			]}
		>
			<Button kind="flat" square checked={!!val()} class={styles.item}>
				{val() ? icons.get(val()!)!() : <IconAlign />}
				<IconArrowDown class="-ms-1" />
			</Button>
		</Dropdown>
	);
}
