// SPDX-FileCopyrightText: 2024 caixw
//
// SPDX-License-Identifier: MIT

import { JSX, Match, mergeProps, Switch } from 'solid-js';

import { Color } from '@/components/base';

export interface Props {
    color?: Color;
    pos?: 'start' | 'center' | 'end';
    children?: JSX.Element;
}

const defaultProps: Partial<Props> = {
    color: undefined,
    pos: 'start'
};

export default function(props: Props) {
    props = mergeProps(defaultProps, props);

    return <div class={props.color ? `divider scheme--${props.color}` : 'divider'}>
        <Switch fallback={<hr class="w-full" />}>
            <Match when={props.pos === 'start' && props.children}>
                {props.children}<hr class="flex-1 ml-2" />
            </Match>
            <Match when={props.pos === 'center' && props.children}>
                <hr class="flex-1 mr-2" />{props.children}<hr class="flex-1 ml-2" />
            </Match>
            <Match when={props.pos === 'end' && props.children}>
                <hr class="flex-1 mr-2" />{props.children}
            </Match>
        </Switch>
    </div>;
}
