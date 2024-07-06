// SPDX-FileCopyrightText: 2024 caixw
//
// SPDX-License-Identifier: MIT

import { For, JSX, mergeProps } from 'solid-js';

import { Color } from '@/components/base';
import { Style } from './types';

export interface Props {
    color?: Color;
    style?: Style;
    rounded?: boolean;
    disabled?: boolean;
    buttons: Array<Button>;
}

interface Button {
    text: JSX.Element;
    action: { (): void };
}

const defaultProps: Partial<Props> = {
    color: 'primary',
    style: 'filled'
};

export default function (props: Props) {
    props = mergeProps(defaultProps, props);

    return <fieldset disabled={props.disabled} classList={{
        'button-group': true,
        'rounded': props.rounded,
        [`scheme--${props.color}`]: true,
        [`${props.style}`]: true
    }}>
        <For each={props.buttons}>
            {(item)=>(
                <button onClick={item.action}>{item.text}</button>
            )}
        </For>
    </fieldset >;
}
