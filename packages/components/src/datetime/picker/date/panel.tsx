// SPDX-FileCopyrightText: 2025-2026 caixw
//
// SPDX-License-Identifier: MIT

import { type JSX, splitProps } from 'solid-js';

import type { BaseRef, RefProps } from '@components/base';
import { CommonPanel, type CommonProps } from '@components/datetime/picker/internal';

export type PanelRef = BaseRef<HTMLFieldSetElement>;

export type Base = Omit<CommonProps, 'viewRef' | 'onEnter' | 'onLeave' | 'ref' | 'popover'>;

export interface PanelProps extends Base, RefProps<PanelRef> {
	readonly popover?: false;
}

/**
 * 日期选择的面板
 */
export function Panel(props: PanelProps): JSX.Element {
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
