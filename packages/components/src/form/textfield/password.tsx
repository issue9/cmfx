// SPDX-FileCopyrightText: 2024-2025 caixw
//
// SPDX-License-Identifier: MIT

import { JSX, Show, createSignal, splitProps } from 'solid-js';
import IconVisibility from '~icons/material-symbols/visibility';
import IconVisibilityOff from '~icons/material-symbols/visibility-off';

import { Button } from '@/button';
import { IconComponent } from '@/icon';
import { Props as BaseProps, TextField, Ref as TextFieldRef } from './textfiled';

export interface Props extends Omit<BaseProps<string>, 'prefix'|'suffix'|'type'|'ref'|'autocomplete'> {
    icon?: IconComponent;
    autocomplete?: 'new-password' | 'current-password' | 'one-time-code' | 'off';
}

/**
 * 密码输入组件
 */
export function Password(props: Props): JSX.Element {
    const [visible, setVisible] = createSignal(false);
    const [_, fieldProps] = splitProps(props, ['icon']);
    let ref: TextFieldRef;

    return <TextField {...fieldProps} type="password" ref={el=>ref=el} prefix={
        <Show when={props.icon}>
            {props.icon!({class:'prefix-icon'})}
        </Show>
    } suffix={
        <Button kind='flat' disabled={props.disabled} square class="!px-1 !py-0 rounded-none"
            onClick={() => {
                setVisible(!visible());
                ref.type = visible() ? 'text' : 'password';
            }}>
            <Show when={visible()} fallback={<IconVisibility />}>
                <IconVisibilityOff />
            </Show>
        </Button>
    } />;
}
