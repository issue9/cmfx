// SPDX-FileCopyrightText: 2026 caixw
//
// SPDX-License-Identifier: MIT

import { type BaseRef, type ClipboardWriter, createClipboardWriter, type RefProps } from '@cmfx/cdk';
import { type JSX, splitProps } from 'solid-js';
import IconOK from '~icons/material-symbols/check';
import IconCopy from '~icons/material-symbols/content-copy';
import IconError from '~icons/material-symbols/error';

import { useOptions } from '@components/context/options';
import { IconSet } from '@components/icon';

export type ClipboardWriterRef = BaseRef<IconSet.Ref> & ClipboardWriter;

export interface ClipboardWriterProps
	extends Omit<IconSet.Props, 'onclick' | 'ref' | 'value' | 'icons'>,
		RefProps<ClipboardWriterRef> {}

/**
 * 提供了一个反映复制到剪切版状态的图标
 */
export function ClipboardW(props: ClipboardWriterProps): JSX.Element {
	const [opt] = useOptions();
	const [, otherP] = splitProps(props, ['ref']);
	let ref: IconSet.Ref;
	const w = createClipboardWriter(v => ref?.to(v), opt.getStays());

	return (
		<IconSet
			{...otherP}
			ref={el => {
				ref = el;
				props.ref?.({
					root: () => el,
					...w,
				});
			}}
			value="pending"
			icons={{
				pending: <IconCopy />,
				ok: <IconOK />,
				error: <IconError />,
			}}
		/>
	);
}
