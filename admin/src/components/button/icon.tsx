// SPDX-FileCopyrightText: 2024 caixw
//
// SPDX-License-Identifier: MIT

import { JSX, mergeProps } from 'solid-js';

import { Props as BaseProps } from './types';

export interface Props extends BaseProps {
    children: string;
    onClick?: { (e?: Event): void };
    title?: string;
    type?: JSX.ButtonHTMLAttributes<HTMLButtonElement>['type'];
}

const defaultProps: Partial<Props> = {
    style: 'filled'
};

/**
 * 仅带图标的按钮组件
 */
export default function(props: Props) {
    props = mergeProps(defaultProps, props);

    return <button type={props.type} title={props.title} disabled={props.disabled} onClick={props.onClick} classList={{
        'material-symbols-outlined': true,
        'icon-button': true,
        [`${props.style}`]: true,
        'rounded-full': props.rounded,
        [`palette--${props.palette}`]: !!props.palette,
    }}>
        {props.children}
    </button>;
}
