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
    disabled?: boolean;
    children: JSX.Element;
    onClick?: { (e?: Event): void };
    title?: string;
}

const defaultProps: Partial<Props> = {
    style: 'filled',
    onClick:()=>{}
};

export default function XIconButton(props: Props) {
    props = mergeProps(defaultProps, props);

    return <button title={props.title} disabled={props.disabled} onClick={(e)=>props.onClick!(e)} classList={{
        'material-symbols-outlined': true,
        'icon-button': true,
        [`${props.style}`]: true,
        'rounded-full': props.rounded,
        [`scheme--${props.color}`]: !!props.color,
    }}>
        {props.children}
    </button >;
}
