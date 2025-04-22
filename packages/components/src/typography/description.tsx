// SPDX-FileCopyrightText: 2024-2025 caixw
//
// SPDX-License-Identifier: MIT

import { JSX, ParentProps, Show } from 'solid-js';

import { BaseProps } from '@/base';
import { IconSymbol } from '@/icon';
import { Label } from './label';

export interface Props extends BaseProps, ParentProps {
    /**
     * 图标
     */
    icon?: IconSymbol;

    /**
     * 标题
     */
    title?: string;

    class?: string;
}

/**
 * 一长段内容的描述信息，可带一个标题。
 */
export function Description(props: Props): JSX.Element {
    return <div class={'c--description ' + (props.class ?? '') + ' ' +(props.palette ? `palette--${props.palette}` : '')}>
        <Show when={props.icon || props.title}>
            <Label class="title" palette={props.palette} icon={props.icon}>{ props.title }</Label>
        </Show>
        <div class="desc">
            { props.children }
        </div>
    </div>;
}
