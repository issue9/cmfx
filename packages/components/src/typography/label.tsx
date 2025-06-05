// SPDX-FileCopyrightText: 2024-2025 caixw
//
// SPDX-License-Identifier: MIT

import { JSX, mergeProps, ParentProps, Show, ValidComponent } from 'solid-js';
import { Dynamic } from 'solid-js/web';

import { BaseProps } from '@/base';
import { IconComponent } from '@/icon';

export interface Props extends BaseProps, ParentProps {
    /**
     * 图标
     */
    icon?: IconComponent;

    /**
     * 标签，默认为 p
     */
    tag?: ValidComponent;

    class?: string;
}

const presetProps: Readonly<Partial<Props>> = {
    tag: 'p',
};

export function Label(props: Props): JSX.Element {
    props = mergeProps(presetProps, props);

    return <Dynamic component={props.tag} class={'c--label '+ (props.class ?? '') + ' ' +(props.palette ? `palette--${props.palette}` : '')}>
        <Show when={props.icon}>
            {props.icon!({class:'mr-1'})}
        </Show>

        { props.children }
    </Dynamic>;
}
