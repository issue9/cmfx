// SPDX-FileCopyrightText: 2024 caixw
//
// SPDX-License-Identifier: MIT

import { For, JSX, mergeProps } from 'solid-js';

import { Props as BaseProps } from './types';

export interface Props extends BaseProps {
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
        [`palette--${props.palette}`]: !!props.palette,
        [`${props.style}`]: true
    }}>
        <For each={props.buttons}>
            {(item)=>(
                <button onClick={item.action}>{item.text}</button>
            )}
        </For>
    </fieldset >;
}
