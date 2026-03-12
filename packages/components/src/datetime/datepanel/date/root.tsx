// SPDX-FileCopyrightText: 2025-2026 caixw
//
// SPDX-License-Identifier: MIT

import { type JSX, splitProps } from 'solid-js';

import type { RefProps } from '@components/base';
import { CommonPanel, type Props as CommonProps } from '@components/datetime/datepanel/common/common.tsx';

export interface Ref {
	root(): HTMLFieldSetElement;
}

export type Props = Omit<CommonProps, 'viewRef' | 'onEnter' | 'onLeave' | 'ref'> & RefProps<Ref>;

/**
 * 日期选择的面板
 */
export function Root(props: Props): JSX.Element {
	const [, p] = splitProps(props, ['ref']);
	return (
		<CommonPanel
			{...p}
			ref={el => {
				if (props.ref) {
					props.ref({
						root: el.root,
					});
				}
			}}
		/>
	);
}
