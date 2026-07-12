// SPDX-FileCopyrightText: 2025-2026 caixw
//
// SPDX-License-Identifier: MIT

import type { ThemeProps } from '@cmfx/themes';
import { type JSX, mergeProps, type ParentProps } from 'solid-js';
import IconNoData from '~icons/oui/index-close';

import type { BaseRef, RefProps } from '@components/base';
import { Result } from '@components/result/result';

export type EmptyRef = BaseRef<Result.Ref>;

export interface EmptyProps extends ThemeProps, ParentProps, RefProps<EmptyRef> {
	/**
	 * 图标
	 *
	 * @defaultValue '~icons/oui/index-close'
	 * @reactive
	 */
	icon?: JSX.Element;
}

const presetProps: EmptyProps = {
	icon: <IconNoData />,
} as const;

/**
 * 表示没有数据的结果页
 */
export function Empty(props: EmptyProps): JSX.Element {
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
