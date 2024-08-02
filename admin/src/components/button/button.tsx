// SPDX-FileCopyrightText: 2024 caixw
//
// SPDX-License-Identifier: MIT

import { JSX, mergeProps } from 'solid-js';

import { Props as BaseProps, ButtonType, ClickFunc, defaultProps } from './types';

export interface Props extends BaseProps {
    children: JSX.Element;
    onClick?: ClickFunc;
    title?: string;
    type?: ButtonType;
    accessKey?: string;
    autofocus?: boolean;
}

/**
 * 普通的按钮组件
 */
export default function(props: Props) {
    props = mergeProps(defaultProps, props);

    return <button accessKey={props.accessKey} autofocus={props.autofocus} disabled={props.disabled}
        type={props.type} title={props.title} onClick={props.onClick} classList={{
            'c--button': true,
            [`c--button-${props.style}`]: true,
            [`palette--${props.palette}`]: !!props.palette,
            'rounded-full': props.rounded,
        }}>
        {props.children}
    </button>;
}
