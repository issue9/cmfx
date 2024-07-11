// SPDX-FileCopyrightText: 2024 caixw
//
// SPDX-License-Identifier: MIT

import { JSX, mergeProps } from 'solid-js';

import { Corner, Scheme } from '@/components/base';

export interface Props {
    scheme?: Scheme;

    /**
     * 控制弹出内容的可见性
     */
    visible?: boolean;

    /**
     * 触发元素
     */
    activator: JSX.Element;

    /**
     * 弹出内容的位置，相对于 activator
     */
    pos?: Corner;

    /**
     * 弹出的内容
     */
    children: JSX.Element;
}

const defaultProps: Partial<Props> = {
    scheme: undefined,
    pos: 'bottomright'
};

export default function(props: Props) {
    props = mergeProps(defaultProps, props);

    return <div classList={{
        'dropdown': true,
        [`scheme--${props.scheme}`]: !!props.scheme
    }}>
        {props.activator}

        <div classList={{
            'content': true,
            [`${props.pos}`]: true,
            'visible': props.visible
        }}>
            {props.children}
        </div>
    </div>;
}
