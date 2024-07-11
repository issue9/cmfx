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
    disabled?: boolean;
    children: JSX.Element;
    onClick?: { (e?: Event): void };
    title?: string;
    type?: JSX.ButtonHTMLAttributes<HTMLButtonElement>['type'];
}

const defaultProps: Partial<Props> = {
    style: 'filled',
    onClick:()=>{}
};

export default function XIconButton(props: Props) {
    props = mergeProps(defaultProps, props);

    return <button type={props.type} title={props.title} disabled={props.disabled} onClick={(e)=>props.onClick!(e)} classList={{
        'material-symbols-outlined': true,
        'icon-button': true,
        [`${props.style}`]: true,
        'rounded-full': props.rounded,
        [`scheme--${props.scheme}`]: !!props.scheme,
    }}>
        {props.children}
    </button>;
}
