// SPDX-FileCopyrightText: 2024 caixw
//
// SPDX-License-Identifier: MIT

import { JSX, mergeProps } from 'solid-js';

import { Color } from '@/components/base';
import { Style } from './types';

export interface Props {
    color?: Color;
    style?: Style;
    rounded?: boolean;
    children: JSX.Element;
    onClick?: { (e?: Event): void };
    disabled?: boolean;
}

const defaultProps: Partial<Props> = {
    color: 'primary',
    style: 'filled',
    onClick:()=>{}
};

/**
 * 普通的非响应式按钮
 */
export default function XButton(props: Props) {
    props = mergeProps(defaultProps, props);

    return <button disabled={props.disabled} onClick={(e)=>props.onClick!(e)} classList={{
        'button': true,
        [`${props.style}`]: true,
        [`scheme--${props.color}`]: true,
        'icon-container': true,
        'rounded-full': props.rounded,
    }}>
        {props.children}
    </button>;
}
