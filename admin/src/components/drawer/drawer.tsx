// SPDX-FileCopyrightText: 2024 caixw
//
// SPDX-License-Identifier: MIT

import { JSX, Match, mergeProps, Switch } from 'solid-js';

import { Color } from '@/components/base';

export interface Props {
    /**
     * 指定了 side 的颜色
     */
    color?: Color;

    show?: boolean;

    pos?: 'left' | 'right';

    aside: JSX.Element;

    children: JSX.Element;
}

const defaultProps: Partial<Props> = {
    pos: 'left'
};

export default function(props: Props) {
    props = mergeProps(defaultProps, props);

    const Aside = ()=><aside classList={{
        [`scheme--${props.color}`]: !!props.color,
        'hiden': props.show === undefined ? false : !props.show,
    }}>
        {props.aside}
    </aside>;

    return <Switch>
        <Match when={props.pos === 'left'}>
            <div class="drawer">
                <Aside />
                <main>{props.children}</main>
            </div>;
        </Match>
        <Match when={props.pos === 'right'}>
            <div class="drawer">
                <main>{props.children}</main>
                <Aside />
            </div>;
        </Match>
    </Switch>;
}
