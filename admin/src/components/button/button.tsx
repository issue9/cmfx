// SPDX-FileCopyrightText: 2024 caixw
//
// SPDX-License-Identifier: MIT

import { JSX, mergeProps } from 'solid-js';

import { Scheme } from '@/components/base';
import { Style } from './types';

export interface Props {
    scheme?: Scheme;
    style?: Style;
    rounded?: boolean;
    children: JSX.Element;
    onClick?: { (e?: Event): void };
    disabled?: boolean;
    title?: string;
    type?: JSX.ButtonHTMLAttributes<HTMLButtonElement>['type'];
}

const defaultProps: Partial<Props> = {
    style: 'filled',
    onClick:()=>{}
};

/**
 * 普通的非响应式按钮
 */
export default function XButton(props: Props) {
    props = mergeProps(defaultProps, props);

    return <button type={props.type} title={props.title} disabled={props.disabled} onClick={(e)=>props.onClick!(e)} classList={{
        'button': true,
        [`${props.style}`]: true,
        [`scheme--${props.scheme}`]: !!props.scheme,
        'icon-container': true,
        'rounded-full': props.rounded,
    }}>
        {props.children}
    </button>;
}
