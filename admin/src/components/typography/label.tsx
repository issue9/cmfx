// SPDX-FileCopyrightText: 2024 caixw
//
// SPDX-License-Identifier: MIT

import { JSX, mergeProps, ParentProps, Show, ValidComponent } from 'solid-js';
import { Dynamic } from 'solid-js/web';

import { BaseProps } from '@/components/base';

export interface Props extends BaseProps, ParentProps {
    /**
     * 图标
     */
    icon?: string;

    /**
     * 标签，默认为 p
     */
    tag?: ValidComponent;
}

const defaultProps: Readonly<Partial<Props>> = {
    tag: 'p',
};

export default function(props: Props): JSX.Element {
    props = mergeProps(defaultProps, props);

    return <Dynamic component={props.tag} class="c--icon-container">
        <Show when={props.icon}>
            <span class="c--icon mr-1">{ props.icon }</span>
        </Show>

        { props.children }
    </Dynamic>;
}