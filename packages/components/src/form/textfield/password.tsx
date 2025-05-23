// SPDX-FileCopyrightText: 2024-2025 caixw
//
// SPDX-License-Identifier: MIT

import { JSX, Show, createSignal, splitProps } from 'solid-js';

import { Button } from '@/button';
import { Icon, IconSymbol } from '@/icon';
import { Props as BaseProps, TextField, Ref as TextFieldRef } from './textfiled';

export interface Props extends Omit<BaseProps<string>, 'prefix'|'suffix'|'type'|'ref'|'autocomplete'> {
    icon?: IconSymbol;
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
            <Icon icon={props.icon!} class="px-1 !flex !items-center !py-0" />
        </Show>
    } suffix={
        <Button kind='flat' disabled={props.disabled} icon class="!px-1 !py-0 rounded-none"
            onClick={() => {
                setVisible(!visible());
                ref.type = visible() ? 'text' : 'password';
            }}>
            {visible() ? 'visibility_off' : 'visibility'}
        </Button>
    } />;
}
