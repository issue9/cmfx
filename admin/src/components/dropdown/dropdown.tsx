// SPDX-FileCopyrightText: 2024 caixw
//
// SPDX-License-Identifier: MIT

import { JSX, mergeProps } from 'solid-js';

import { Color } from '@/components/base';

export interface Props {
    color?: Color;
    show?: boolean;
    children: JSX.Element;
}

const defaultProps: Partial<Props> = {
    color: undefined
};

export default function(props: Props) {
    props = mergeProps(defaultProps, props);

    return <div class="dropdown">
        <div classList={{
            'content': true,
            'show': props.show,
            [`scheme--${props.color}`]: !!props.color
        }}>
            {props.children}
        </div>
    </div>;
}
