// SPDX-FileCopyrightText: 2024 caixw
//
// SPDX-License-Identifier: MIT

import { JSX, mergeProps } from 'solid-js';

import { Corner, Scheme } from '@/components/base';

export interface Props {
    scheme?: Scheme;
    pos?: Corner;
    text?: string | number;
    children: JSX.Element;
}

const defaultProps: Partial<Props> = {
    scheme: undefined,
    pos: 'topright'
};

export default function(props: Props) {
    props = mergeProps(defaultProps, props);

    return <div class="badge">
        {props.children}
        <span classList={{
            'content': true,
            [props.pos as string]: true,
            [`scheme--${props.scheme}`]: props.scheme ? true : false
        }}>{ props.text }</span >
    </div>;
}
