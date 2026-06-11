// SPDX-FileCopyrightText: 2026 caixw
//
// SPDX-License-Identifier: MIT

import { type JSX, splitProps } from 'solid-js';
import IconOK from '~icons/material-symbols/check';
import IconCopy from '~icons/material-symbols/content-copy';
import IconError from '~icons/material-symbols/error';

import type { RefProps } from '@components/base';
import { useOptions } from '@components/context';
import { IconSet } from '@components/icon';
import { buildRef, type ClipboardAPIRef } from './clipboard';

export interface ClipboardAPIProps
	extends Omit<IconSet.Props, 'onclick' | 'ref' | 'value' | 'icons'>,
		RefProps<ClipboardAPIRef> {}

/**
 * 提供了一个反映复制到剪切版状态的图标
 */
export function ClipboardAPI(props: ClipboardAPIProps): JSX.Element {
	const [opt] = useOptions();
	const [, otherP] = splitProps(props, ['ref']);

	return (
		<IconSet
			{...otherP}
			ref={el => {
				if (props.ref) {
					props.ref(buildRef(el, opt));
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
