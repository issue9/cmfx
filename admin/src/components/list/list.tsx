// SPDX-FileCopyrightText: 2024 caixw
//
// SPDX-License-Identifier: MIT

import { JSX, mergeProps } from 'solid-js';

import { Scheme } from '@/components/base';

export interface Props {
    color?: Scheme;
    children: JSX.Element;
}

const defaultProps: Partial<Props> = {
    color: undefined
};

export default function (props: Props): JSX.Element {
    props = mergeProps(defaultProps, props);

    return <menu role="menu" class={props.color ? `list scheme--${props.color}` : 'list'}>
        { props.children }
    </menu>;
}
