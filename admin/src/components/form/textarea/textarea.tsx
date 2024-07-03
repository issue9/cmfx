// SPDX-FileCopyrightText: 2024 caixw
//
// SPDX-License-Identifier: MIT

import { JSX, mergeProps, Show } from 'solid-js';

import { Color } from '@/components/base';
import { Form, Object } from '@/components/form';
import { default as XField } from '@/components/form/field';

export interface Props<T extends Object> {
    name: keyof T;
    color?: Color;
    label?: string;
    placeholder?: string;
    disabled?: boolean;
    readonly?: boolean;
    f: Form<T>;
}

export default function XTextField<T extends Object>(props: Props<T>):JSX.Element {
    type ft = T[typeof props.name];
    props = mergeProps({color:'primary', type:'text'}, props) as Props<T>; // 指定默认值
    let fieldRef;

    return <XField ref={fieldRef} name={props.name} f={props.f}>
        <label>
            <Show when={props.label}>
                {props.label}
            </Show>
            <textarea class={`textarea scheme--${props.color}`}
                disabled={props.disabled}
                readOnly={props.readonly}
                placeholder={props.placeholder}
                value={fieldRef.getValue()()}
                onInput={(e)=>fieldRef.setValue(e.target.value as ft)} />
        </label>
    </XField>;
}
