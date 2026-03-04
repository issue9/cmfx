// SPDX-FileCopyrightText: 2025-2026 caixw
//
// SPDX-License-Identifier: MIT

import { JSX, splitProps } from 'solid-js';

import { RefProps } from '@components/base';
import { CommonPanel, Props as CommonProps } from './common';

export interface Ref {
	root(): HTMLFieldSetElement;
}

export type Props = Omit<CommonProps, 'viewRef' | 'onEnter' | 'onLeave' | 'ref'> & RefProps<Ref>;

/**
 * 日期选择的面板
 */
export function DatePanel(props: Props): JSX.Element {
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
