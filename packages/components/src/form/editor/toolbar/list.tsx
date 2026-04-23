// SPDX-FileCopyrightText: 2026 caixw
//
// SPDX-License-Identifier: MIT

import { createSignal, type JSX, onCleanup, onMount, type ParentProps } from 'solid-js';
import IconBulleted from '~icons/material-symbols/format-list-bulleted-rounded';
import IconNumbered from '~icons/material-symbols/format-list-numbered-rounded';
import IconArrowDown from '~icons/material-symbols/keyboard-arrow-down-rounded';
import IconList from '~icons/material-symbols/lists-rounded';

import { Button } from '@components/button';
import { useLocale } from '@components/context';
import { Dropdown } from '@components/menu';
import styles from './style.module.css';
import type { Props as ItemProps } from './types';

const keys = ['numbered', 'bulleted'] as const;

type Key = (typeof keys)[number];

const icons: ReadonlyMap<Key, () => JSX.Element> = new Map([
	['numbered', () => <IconNumbered />],
	['bulleted', () => <IconBulleted />],
]);

type Props = ParentProps & ItemProps;

/**
 * 列表
 */
export function List(props: Props): JSX.Element {
	const l = useLocale();
	const [val, setVal] = createSignal<Key>();

	const transaction = () => {
		if (props.editor.isActive('orderedList')) {
			setVal('numbered');
		} else if (props.editor.isActive('bulletList')) {
			setVal('bulleted');
		} else {
			setVal();
		}
	};
	onMount(() => props.editor.on('transaction', transaction));
	onCleanup(() => props.editor.off('transaction', transaction));

	return (
		<Dropdown.Root
			value={val()}
			align="start"
			onChange={v => {
				switch (v) {
					case 'numbered':
						props.editor.chain().focus().toggleOrderedList().run();
						break;
					case 'bulleted':
						props.editor.chain().focus().toggleBulletList().run();
						break;
				}
			}}
			ref={el => el.trigger().classList.add(styles.item)}
			items={[
				{ type: 'item', value: 'numbered', prefix: icons.get('numbered')!(), label: l.t('_c.editor.numberedList') },
				{ type: 'item', value: 'bulleted', prefix: icons.get('bulleted')!(), label: l.t('_c.editor.bulletedList') },
			]}
		>
			<Button.Root kind="flat" square checked={!!val()} class={styles.item}>
				{val() ? icons.get(val()!)!() : <IconList />}
				<IconArrowDown class="-ms-1" />
			</Button.Root>
		</Dropdown.Root>
	);
}
