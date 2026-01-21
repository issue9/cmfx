// SPDX-FileCopyrightText: 2024-2026 caixw
//
// SPDX-License-Identifier: MIT

import { JSX, createSignal, mergeProps, onMount } from 'solid-js';
import IconVisibility from '~icons/material-symbols/visibility';
import IconVisibilityOff from '~icons/material-symbols/visibility-off';

import { ToggleButton } from '@components/button';
import { useForm } from '@components/form/field';
import { Props as BaseProps, TextField, Ref as TextFieldRef } from './textfield';

export interface Props extends Omit<BaseProps<string>, 'suffix' | 'type' | 'ref' | 'autocomplete'> {
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
export function Password(props: Props): JSX.Element {
    const form = useForm(); // Password 在 textfield 的外层，所以得保证 useForm 是可用的。
    props = mergeProps(form, props);

    const [visible, setVisible] = createSignal(!!props.visible);
    let ref: TextFieldRef;

    onMount(() => {
        ref.input().type = props.visible ? 'text' : 'password';
    });

    return <TextField {...props} type="password" ref={el => ref = el} suffix={
        <ToggleButton kind='flat' square disabled={props.disabled || props.readonly} value={props.visible}
            off={<IconVisibility />} on={<IconVisibilityOff />} toggle={async () => {
                setVisible(!visible());
                ref.input().type = visible() ? 'text' : 'password';
                return visible();
            }} />
    } />;
}
