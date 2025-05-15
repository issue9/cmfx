// SPDX-FileCopyrightText: 2024-2025 caixw
//
// SPDX-License-Identifier: MIT

import { JSX, mergeProps } from 'solid-js';

import { Layout } from '@/base';
import { Props as BaseProps, presetProps as presetBaseProps } from './types';

export type Ref = HTMLFieldSetElement;

export interface Props extends BaseProps {
    /**
     * 子元素，必须得是 Button 或是 LinkButton 类型。
     */
    children: JSX.Element;

    disabled?: boolean;

    ref?: { (el: Ref): void; };

    class?: string;

    layout?: Layout;
}

const presetProps: Readonly<Partial<Props>> = {
    ...presetBaseProps,
    layout: 'horizontal'
} as const;

export function ButtonGroup(props: Props) {
    props = mergeProps(presetProps, props);

    return <fieldset role="group" class={props.class} ref={(el) => { if (props.ref) { props.ref(el); }}} disabled={props.disabled} classList={{
        'c--button-group': true,
        'c--button-group-rounded': props.rounded,
        'vertical': props.layout === 'vertical',
        [`c--button-group-${props.kind}`]: true,
        [`palette--${props.palette}`]: !!props.palette
    }}>
        {props.children}
    </fieldset >;
}
