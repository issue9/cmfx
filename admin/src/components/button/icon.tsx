// SPDX-FileCopyrightText: 2024 caixw
//
// SPDX-License-Identifier: MIT

import { mergeProps } from 'solid-js';

import { Props as BaseProps, ButtonType, ClickFunc, defaultProps } from './types';

export interface Props extends BaseProps {
    /**
     * 图标名称 https://fonts.google.com/icons
     */
    children: string;

    onClick?: ClickFunc;
    title?: string;
    type?: ButtonType;
}

/**
 * 仅带图标的按钮组件
 */
export default function(props: Props) {
    props = mergeProps(defaultProps, props);

    return <button type={props.type} title={props.title} disabled={props.disabled} onClick={props.onClick} classList={{
        'component': true,
        'material-symbols-outlined': true,
        'c--icon-button': true,
        'rounded-full': props.rounded,
        [`palette--${props.palette}`]: !!props.palette,
        [`button-style--${props.style}`]: true
    }}>
        {props.children}
    </button>;
}
