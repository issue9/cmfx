// SPDX-FileCopyrightText: 2024 caixw
//
// SPDX-License-Identifier: MIT

import { JSX, Match, mergeProps, Switch } from 'solid-js';

import { Scheme } from '@/components/base';

export interface Props {
    scheme?: Scheme;

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
        [`scheme--${props.scheme}`]: !!props.scheme,
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
