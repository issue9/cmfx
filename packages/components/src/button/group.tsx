// SPDX-FileCopyrightText: 2024-2026 caixw
//
// SPDX-License-Identifier: MIT

import { JSX, mergeProps, ParentProps } from 'solid-js';

import { classList, Layout, RefProps } from '@components/base';
import styles from './style.module.css';
import { Props as BaseProps, presetProps as presetBaseProps } from './types';

export interface Ref {
    root(): HTMLFieldSetElement;
}

export interface Props extends Omit<BaseProps, 'hotkey'>, ParentProps, RefProps<Ref> {
    layout?: Layout;
}

const presetProps: Readonly<Partial<Props>> = {
    ...presetBaseProps,
    layout: 'horizontal'
} as const;

/**
 * 按钮分组
 *
 * @remarks
 * 该组件用于将多个按钮组合在一起，形成一个按钮组。子组件必须是 Button 组件。
 */
export function ButtonGroup(props: Props): JSX.Element {
    props = mergeProps(presetProps, props);

    return <fieldset role="group" disabled={props.disabled} aria-orientation={props.layout}
        class={classList(props.palette, {
            [styles.rounded]: props.rounded,
            [styles.vertical]: props.layout === 'vertical',
        }, styles.group, styles[props.kind!], props.class)}
        style={props.style} ref={el => {
            if (props.ref) { props.ref({ root() { return el; } }); }
        }}
    >
        {props.children}
    </fieldset>;
}
