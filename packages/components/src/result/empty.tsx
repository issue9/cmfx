// SPDX-FileCopyrightText: 2025-2026 caixw
//
// SPDX-License-Identifier: MIT

import { JSX, mergeProps, ParentProps } from 'solid-js';
import IconNoData from '~icons/oui/index-close';

import { BaseProps, RefProps } from '@components/base';
import Result, { Ref as ResultRef } from './result';

export interface Ref {
	root(): ResultRef;
}

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
export default function Empty(props: Props): JSX.Element {
	props = mergeProps(presetProps, props);

	return (
		<Result
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
		</Result>
	);
}
