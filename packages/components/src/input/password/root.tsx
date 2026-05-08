// SPDX-FileCopyrightText: 2024-2026 caixw
//
// SPDX-License-Identifier: MIT

import { type JSX, mergeProps, onMount } from 'solid-js';
import IconVisibility from '~icons/material-symbols/visibility';
import IconVisibilityOff from '~icons/material-symbols/visibility-off';

import type { RefProps } from '@components/base';
import { ToggleButton } from '@components/button';
import { Form } from '@components/form';
import { InputText } from '@components/input/text';

export type Ref = InputText.RootRef;

type omitFields = 'suffix' | 'type' | 'ref' | 'autocomplete';
export interface Props extends Omit<InputText.RootProps, omitFields>, RefProps<Ref> {
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
	const form = Form.useForm();
	props = mergeProps({ tabindex: 0 }, form, props);

	let ref: InputText.RootRef;

	onMount(() => {
		ref.input().type = props.visible ? 'text' : 'password';
	});

	return (
		<InputText.Root
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
