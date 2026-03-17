// SPDX-FileCopyrightText: 2026 caixw
//
// SPDX-License-Identifier: MIT

import { splitProps } from 'solid-js';
import IconOK from '~icons/material-symbols/check';
import IconCopy from '~icons/material-symbols/content-copy';
import IconError from '~icons/material-symbols/error';

import type { RefProps } from '@components/base';
import { useOptions } from '@components/context';
import { IconSet } from '@components/icon';
import { buildRef, type Ref } from './clipboard';

export interface Props extends Omit<IconSet.RootProps, 'onclick' | 'ref' | 'value' | 'icons'>, RefProps<Ref> {}

/**
 * 提供了一个反映复制到剪切版状态的图标
 */
export function Root(props: Props) {
	const [opt] = useOptions();
	const [, otherP] = splitProps(props, ['ref']);

	return (
		<IconSet.Root
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
