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
    /**
     * 按钮内的文本内容，不包含按钮本身。
     */
    text: JSX.Element;

    /**
    * 点击该按钮执行的操作
    */
    action: { (): void };
}

const defaultProps: Partial<Props> = {
    style: 'filled'
};

export default function (props: Props) {
    props = mergeProps(defaultProps, props);

    return <fieldset disabled={props.disabled} classList={{
        'button-group': true,
        'rounded': props.rounded,
        [`scheme--${props.color}`]: !!props.color,
        [`${props.style}`]: true
    }}>
        <For each={props.buttons}>
            {(item)=>(
                <button onClick={item.action}>{item.text}</button>
            )}
        </For>
    </fieldset >;
}
