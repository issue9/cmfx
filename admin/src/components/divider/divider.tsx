// SPDX-FileCopyrightText: 2024 caixw
//
// SPDX-License-Identifier: MIT

import { Match, mergeProps, ParentProps, Switch } from 'solid-js';

import { BaseProps } from '@/components/base';
import { Style } from './types';

export type Props = ParentProps<{
    pos?: 'start' | 'center' | 'end';
    style?: Style;
} & BaseProps>;

const defaultProps: Readonly<Props> = {
    style: 'solid',
    pos: 'start'
};

export default function(props: Props) {
    props = mergeProps(defaultProps, props);

    return <div classList={{
        'c--divider': true,
        [`palette--${props.palette}`]: !!props.palette,
    }}>
        <Switch fallback={<hr class="w-full" />}>
            <Match when={props.pos === 'start' && props.children}>
                {props.children}<hr style={{ 'border-style': props.style }} class="flex-1 ml-2" />
            </Match>
            <Match when={props.pos === 'center' && props.children}>
                <hr style={{ 'border-style': props.style }} class="flex-1 mr-2" />{props.children}<hr style={{ 'border-style': props.style }} class="flex-1 ml-2" />
            </Match>
            <Match when={props.pos === 'end' && props.children}>
                <hr style={{ 'border-style': props.style }} class="flex-1 mr-2" />{props.children}
            </Match>
        </Switch>
    </div>;
}
