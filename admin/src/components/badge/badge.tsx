// SPDX-FileCopyrightText: 2024 caixw
//
// SPDX-License-Identifier: MIT

import { JSX, mergeProps } from 'solid-js';

import { BaseProps, Corner } from '@/components/base';

export interface Props extends BaseProps {
    pos?: Corner;
    text?: string | number;
    children: JSX.Element;
};

const defaultProps: Readonly<Partial<Props>> = {
    pos: 'topright'
};

export default function(props: Props) {
    props = mergeProps(defaultProps, props);

    return <div class="c--badge">
        {props.children}
        <span classList={{
            'content': true,
            [props.pos as string]: true,
            [`palette--${props.palette}`]: !!props.palette,
        }}>{ props.text }</span >
    </div>;
}
