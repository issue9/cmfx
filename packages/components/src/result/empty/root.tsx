// SPDX-FileCopyrightText: 2025-2026 caixw
//
// SPDX-License-Identifier: MIT

import { type JSX, mergeProps, type ParentProps } from 'solid-js';
import IconNoData from '~icons/oui/index-close';

import type { BaseProps, BaseRef, RefProps } from '@components/base';
import { Result } from '@components/result/result';

export type Ref = BaseRef<Result.RootRef>;

export interface Props extends BaseProps, ParentProps, RefProps<Ref> {
	/**
	 * 图标
	 *
	 * @defaultValue '~icons/oui/index-close'
	 * @reactive
	 */
	icon?: JSX.Element;
}

const presetProps: Props = {
	icon: <IconNoData />,
} as const;

/**
 * 表示没有数据的结果页
 */
export function Root(props: Props): JSX.Element {
	props = mergeProps(presetProps, props);

	return (
		<Result.Root
			layout="vertical"
			class={props.class}
			style={props.style}
			gap="2px"
			palette={props.palette}
			illustration={props.icon}
			ref={el => {
				if (props.ref) {
					props.ref({ root: () => el });
				}
			}}
		>
			{props.children}
		</Result.Root>
	);
}
