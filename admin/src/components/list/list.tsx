// SPDX-FileCopyrightText: 2024 caixw
//
// SPDX-License-Identifier: MIT

import { JSX } from 'solid-js';

import { BaseProps } from '@/components/base';

export interface Props extends BaseProps {
    children: JSX.Element;
}

export default function (props: Props): JSX.Element {
    return <menu role="menu" class={props.palette ? `list palette--${props.palette}` : 'list'}>
        { props.children }
    </menu>;
}
