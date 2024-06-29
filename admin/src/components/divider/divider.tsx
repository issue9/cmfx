// SPDX-FileCopyrightText: 2024 caixw
//
// SPDX-License-Identifier: MIT

import { JSX, mergeProps } from 'solid-js';

import { Color } from '@/components/base';

export interface Props {
    color?: Color;
    pos?: 'start' | 'center' | 'end';
    children?: JSX.Element;
}

export default function(props: Props) {
    if (!props.children) {
        return <hr />;
    }

    props = mergeProps({ pos: 'left' }, props) as Props;
    const cls = props.color ? `divider color--${props.color}` : 'divider';

    switch (props.pos) {
    case 'start':
        return <div class={cls}>
            {props.children}<hr class="flex-1 ml-2" />
        </div>;
    case 'center':
        return <div class={cls}>
            <hr class="flex-1 mr-2" />{props.children}<hr class="flex-1 ml-2" />
        </div>;
    case 'end':
        return <div class={cls}>
            <hr class="flex-1 mr-2" />{props.children}
        </div>;
    }
}
