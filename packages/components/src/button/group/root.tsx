// SPDX-FileCopyrightText: 2024-2026 caixw
//
// SPDX-License-Identifier: MIT

import type { JSX, ParentProps } from 'solid-js';
import { mergeProps } from 'solid-js';

import type { BaseRef, Layout, RefProps } from '@components/base';
import { classList } from '@components/base';
import styles from '@components/button/common/style.module.css';
import type { Props as BaseProps } from '@components/button/common/types';
import { presetProps as presetBaseProps } from '@components/button/common/types';

export type Ref = BaseRef<HTMLFieldSetElement>;

export interface Props extends Omit<BaseProps, 'hotkey'>, ParentProps, RefProps<Ref> {
	layout?: Layout;
}

export const presetProps: Readonly<Partial<Props>> = {
	...presetBaseProps,
	layout: 'horizontal',
} as const;

/**
 * 按钮分组
 *
 * @remarks
 * 该组件用于将多个按钮组合在一起，形成一个按钮组。子组件必须是 Button 组件。
 */
export function Root(props: Props): JSX.Element {
	props = mergeProps(presetProps, props);

	return (
		<fieldset
			disabled={props.disabled}
			class={classList(
				props.palette,
				{
					[styles.rounded]: props.rounded,
					[styles.vertical]: props.layout === 'vertical',
				},
				styles.group,
				styles[props.kind!],
				props.class,
			)}
			style={props.style}
			ref={el => {
				if (props.ref) {
					props.ref({
						root: () => el,
					});
				}
			}}
		>
			{props.children}
		</fieldset>
	);
}
