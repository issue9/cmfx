// SPDX-FileCopyrightText: 2024-2025 caixw
//
// SPDX-License-Identifier: MIT

import { ParentProps, mergeProps } from 'solid-js';

import { classList, Layout, RefProps } from '@/base';
import styles from './style.module.css';
import { Props as BaseProps, presetProps as presetBaseProps } from './types';

export interface Ref {
    element(): HTMLFieldSetElement;
}

export interface Props extends Omit<BaseProps, 'hotkey'>, ParentProps, RefProps<Ref> {
    layout?: Layout;
}

const presetProps: Readonly<Partial<Props>> = {
    ...presetBaseProps,
    layout: 'horizontal'
} as const;

export function ButtonGroup(props: Props) {
    props = mergeProps(presetProps, props);

    return <fieldset role="group" disabled={props.disabled}
        aria-orientation={props.layout}
        class={classList(props.palette, {
            [styles.rounded]: props.rounded,
            [styles.vertical]: props.layout === 'vertical',
        }, styles.group, styles[props.kind!], props.class)}
        ref={el => {
            if (props.ref) { props.ref({ element() { return el; } }); }
        }}
    >
        {props.children}
    </fieldset>;
}
