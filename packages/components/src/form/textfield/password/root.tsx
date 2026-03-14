// SPDX-FileCopyrightText: 2024-2026 caixw
//
// SPDX-License-Identifier: MIT

import { type JSX, mergeProps, onMount } from 'solid-js';
import IconVisibility from '~icons/material-symbols/visibility';
import IconVisibilityOff from '~icons/material-symbols/visibility-off';

import type { RefProps } from '@components/base';
import { ToggleButton } from '@components/button';
import { useForm } from '@components/form/field';
import { TextField } from '@components/form/textfield/textfield';

export type Ref = TextField.RootRef;

type omitFields = 'suffix' | 'type' | 'ref' | 'autocomplete';
export interface Props extends Omit<TextField.RootProps, omitFields>, RefProps<Ref> {
	autocomplete?: 'new-password' | 'current-password' | 'one-time-code' | 'off';

	/**
	 * 默认情况下密码是否可见
	 *
	 * @reactive
	 */
	visible?: boolean;
}

/**
 * 密码输入组件
 */
export function Root(props: Props): JSX.Element {
	const form = useForm(); // Password 在 textfield 的外层，所以得保证 useForm 是可用的。
	props = mergeProps(form, props);

	let ref: TextField.RootRef;

	onMount(() => {
		ref.input().type = props.visible ? 'text' : 'password';
	});

	return (
		<TextField.Root
			{...props}
			type="password"
			ref={el => {
				ref = el;
				if (props.ref) {
					props.ref(el);
				}
			}}
			suffix={
				<ToggleButton.Root
					kind="flat"
					square
					disabled={props.disabled || props.readonly}
					value={props.visible}
					off={<IconVisibility />}
					on={<IconVisibilityOff />}
					onToggle={async (v: boolean) => {
						ref.input().type = v ? 'text' : 'password';
						return v;
					}}
				/>
			}
		/>
	);
}
