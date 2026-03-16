// SPDX-FileCopyrightText: 2026 caixw
//
// SPDX-License-Identifier: MIT

import { sleep, write2Clipboard } from '@cmfx/core';
import { splitProps } from 'solid-js';
import IconOK from '~icons/material-symbols/check';
import IconCopy from '~icons/material-symbols/content-copy';
import IconError from '~icons/material-symbols/error';

import { joinClass, type RefProps } from '@components/base';
import { useOptions } from '@components/context';
import { IconSet } from '@components/icon';
import styles from './style.module.css';

export interface Ref {
	/**
	 * 复制内容
	 */
	copy(): Promise<void>;

	/**
	 * 根元素
	 */
	root(): IconSet.RootRef;
}

export interface Props extends Omit<IconSet.RootProps, 'onclick' | 'ref' | 'value' | 'icons'>, RefProps<Ref> {
	/**
	 * 获取需要复制的文本
	 */
	getText: () => Promise<string>;
}

export function Root(props: Props) {
	let iconsetRef!: IconSet.RootRef;

	const [opt] = useOptions();

	const copy = async (): Promise<void> => {
		await write2Clipboard(await props.getText(), ok => {
			iconsetRef.to(ok ? 'ok' : 'error');
		});

		await sleep(opt.getStays());
		iconsetRef.to('copy');
	};

	const [, otherP] = splitProps(props, ['palette', 'class', 'ref', 'getText']);

	return (
		<IconSet.Root
			{...otherP}
			class={joinClass(props.palette, styles.copy, props.class)}
			ref={el => {
				iconsetRef = el;
				el.root().onclick = copy;

				if (props.ref) {
					props.ref({
						root: () => el,
						copy: copy,
					});
				}
			}}
			value="copy"
			icons={{
				copy: <IconCopy />,
				ok: <IconOK />,
				error: <IconError />,
			}}
		/>
	);
}
