// SPDX-FileCopyrightText: 2024 caixw
//
// SPDX-License-Identifier: MIT

import { JSX, mergeProps } from 'solid-js';

import { Props as BaseProps, defaultProps } from './types';

export interface Props extends BaseProps {
    /**
     * 子元素，必须得是 Button 类型。
     */
    children: JSX.Element;
}

export default function (props: Props) {
    props = mergeProps(defaultProps, props);

    return <fieldset role="group" disabled={props.disabled} classList={{
        'c--button-group': true,
        'c--button-group-rounded': props.rounded,
        [`c--button-group-${props.style}`]: true,
        [`palette--${props.palette}`]: !!props.palette
    }}>
        {props.children}
    </fieldset >;
}
