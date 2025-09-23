// SPDX-FileCopyrightText: 2024-2025 caixw
//
// SPDX-License-Identifier: MIT

import { JSX, createSignal } from 'solid-js';
import IconVisibility from '~icons/material-symbols/visibility';
import IconVisibilityOff from '~icons/material-symbols/visibility-off';

import { Button } from '@/button';
import { AnimationIcon, AnimationIconRef } from '@/icon';
import { Props as BaseProps, TextField, Ref as TextFieldRef } from './textfield';

export interface Props extends Omit<BaseProps<string>, 'suffix' | 'type' | 'ref' | 'autocomplete'> {
    autocomplete?: 'new-password' | 'current-password' | 'one-time-code' | 'off';
}

/**
 * 密码输入组件
 */
export function Password(props: Props): JSX.Element {
    const [visible, setVisible] = createSignal(false);
    let ref: TextFieldRef;
    let aref: AnimationIconRef;

    return <TextField {...props} type="password" ref={el=>ref=el} suffix={
        <Button kind='flat' disabled={props.disabled} square class="!px-1 !py-0 rounded-none"
            onClick={() => {
                setVisible(!visible());
                ref.type = visible() ? 'text' : 'password';
                aref.to(visible() ? 'visible' : 'hidden');
            }}>
            <AnimationIcon ref={el=>aref=el} icons={{
                visible: <IconVisibility />,
                hidden: <IconVisibilityOff />
            }} />
        </Button>
    } />;
}
