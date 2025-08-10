// SPDX-FileCopyrightText: 2024-2025 caixw
//
// SPDX-License-Identifier: MIT

import { JSX, mergeProps } from 'solid-js';

import { classList, Layout } from '@/base';
import styles from './style.module.css';
import { Props as BaseProps, presetProps as presetBaseProps } from './types';

export type Ref = HTMLFieldSetElement;

export interface Props extends Omit<BaseProps, 'hotkey'> {
    /**
     * 子元素，必须得是 Button 或是 LinkButton 类型。
     */
    children: JSX.Element;

    disabled?: boolean;

    ref?: { (el: Ref): void; };

    layout?: Layout;
}

const presetProps: Readonly<Partial<Props>> = {
    ...presetBaseProps,
    layout: 'horizontal'
} as const;

export function ButtonGroup(props: Props) {
    props = mergeProps(presetProps, props);

    return <fieldset role="group" ref={el => { if (props.ref) { props.ref(el); } }} disabled={props.disabled}
        class={classList({
            [styles.rounded]: props.rounded,
            [styles.vertical]: props.layout === 'vertical',
            [`palette--${props.palette}`]: !!props.palette
        }, styles.group, styles[props.kind!], props.class)}
    >
        {props.children}
    </fieldset>;
}
