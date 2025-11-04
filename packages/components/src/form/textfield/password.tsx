// SPDX-FileCopyrightText: 2024-2025 caixw
//
// SPDX-License-Identifier: MIT

import { JSX, createSignal, onMount } from 'solid-js';
import IconVisibility from '~icons/material-symbols/visibility';
import IconVisibilityOff from '~icons/material-symbols/visibility-off';

import { ToggleButton } from '@/button';
import { Props as BaseProps, TextField, Ref as TextFieldRef } from './textfield';
import styles from './style.module.css';

export interface Props extends Omit<BaseProps<string>, 'suffix' | 'type' | 'ref' | 'autocomplete'> {
    autocomplete?: 'new-password' | 'current-password' | 'one-time-code' | 'off';

    /**
     * 默认情况下密码是否可见
     */
    visible?: boolean;
}

/**
 * 密码输入组件
 */
export function Password(props: Props): JSX.Element {
    const [visible, setVisible] = createSignal(!!props.visible);
    let ref: TextFieldRef;

    onMount(() => {
        ref.input().type = props.visible ? 'text' : 'password';
    });

    return <TextField {...props} type="password" class={styles.pasword} ref={el => ref = el} suffix={
        <ToggleButton kind='flat' animation square disabled={props.disabled || props.readonly} value={props.visible}
            off={<IconVisibility />} on={<IconVisibilityOff />} toggle={async () => {
                setVisible(!visible());
                ref.input().type = visible() ? 'text' : 'password';
                return visible();
            }} />
    } />;
}
