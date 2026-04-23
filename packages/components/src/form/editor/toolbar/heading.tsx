// SPDX-FileCopyrightText: 2026 caixw
//
// SPDX-License-Identifier: MIT

import { createSignal, type JSX, onCleanup, onMount, type ParentProps } from 'solid-js';
import IconH1 from '~icons/material-symbols/format-h1-rounded';
import IconH2 from '~icons/material-symbols/format-h2-rounded';
import IconH3 from '~icons/material-symbols/format-h3-rounded';
import IconH4 from '~icons/material-symbols/format-h4-rounded';
import IconH5 from '~icons/material-symbols/format-h5-rounded';
import IconH6 from '~icons/material-symbols/format-h6-rounded';
import IconH from '~icons/material-symbols/h-mobiledata-rounded';
import IconArrowDown from '~icons/material-symbols/keyboard-arrow-down-rounded';

import { Button } from '@components/button';
import { useLocale } from '@components/context';
import { Dropdown } from '@components/menu';
import styles from './style.module.css';
import type { Props as ItemProps } from './types';

const icons: ReadonlyMap<number, () => JSX.Element> = new Map([
	[0, () => <IconH />],
	[1, () => <IconH1 />],
	[2, () => <IconH2 />],
	[3, () => <IconH3 />],
	[4, () => <IconH4 />],
	[5, () => <IconH5 />],
	[6, () => <IconH6 />],
]);

type Props = ParentProps & ItemProps;

export function Heading(props: Props): JSX.Element {
	const l = useLocale();
	const [val, setVal] = createSignal(0);

	const transaction = () => {
		if (props.editor.isActive('heading', { level: 1 })) {
			setVal(1);
		} else if (props.editor.isActive('heading', { level: 2 })) {
			setVal(2);
		} else if (props.editor.isActive('heading', { level: 3 })) {
			setVal(3);
		} else if (props.editor.isActive('heading', { level: 4 })) {
			setVal(4);
		} else if (props.editor.isActive('heading', { level: 5 })) {
			setVal(5);
		} else if (props.editor.isActive('heading', { level: 6 })) {
			setVal(6);
		} else {
			setVal(0);
		}
	};
	onMount(() => props.editor.on('transaction', transaction));
	onCleanup(() => props.editor.off('transaction', transaction));

	return (
		<Dropdown.Root
			align="start"
			onChange={v => props.editor.chain().focus().toggleHeading({ level: v }).run()}
			ref={el => el.trigger().classList.add(styles['dropdown-activator'])}
			items={[
				{ type: 'item', value: 1, prefix: icons.get(1)!(), label: l.t('_c.editor.header1') },
				{ type: 'item', value: 2, prefix: icons.get(2)!(), label: l.t('_c.editor.header2') },
				{ type: 'item', value: 3, prefix: icons.get(3)!(), label: l.t('_c.editor.header3') },
				{ type: 'item', value: 4, prefix: icons.get(4)!(), label: l.t('_c.editor.header4') },
				{ type: 'item', value: 5, prefix: icons.get(5)!(), label: l.t('_c.editor.header5') },
				{ type: 'item', value: 6, prefix: icons.get(6)!(), label: l.t('_c.editor.header6') },
			]}
		>
			<Button.Root kind="flat" square checked={val() !== 0} class={styles.item}>
				{icons.get(val())!()}
				<IconArrowDown class="-ms-1" />
			</Button.Root>
		</Dropdown.Root>
	);
}
