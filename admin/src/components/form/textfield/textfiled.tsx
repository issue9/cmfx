// SPDX-FileCopyrightText: 2024 caixw
//
// SPDX-License-Identifier: MIT

import { JSX, mergeProps, Show } from 'solid-js';

import { Color } from '@/components/base';
import { default as XField } from '@/components/form/field';
import { Form, Object } from '@/components/form/form';

export interface Props<T extends Object> {
    name: keyof T;
    color?: Color;
    icon?: string;
    label?: string;
    placeholder?: string;
    type?: 'text' | 'password' | 'url' | 'email' | 'number' | 'date';
    disabled?: boolean;
    readonly?: boolean;
    f: Form<T>;
}

export default function XTextField<T extends Object>(props: Props<T>):JSX.Element {
    type ft = T[typeof props.name];
    props = mergeProps({ color: 'primary' }, props) as Props<T>;
    let fieldRef;

    return <XField ref={fieldRef} name={props.name} f={props.f}>
        <label>
            <Show when={props.label}>
                {props.label}
            </Show>
            <div class={`text-field scheme--${props.color}`}>
                <Show when={props.icon}>
                    <span role="none" class="material-symbols-outlined">{props.icon}</span>
                </Show>
                <input type={props.type}
                    disabled={props.disabled}
                    readOnly={props.readonly}
                    placeholder={props.placeholder}
                    value={fieldRef.getValue()()}
                    onInput={(e)=>fieldRef.setValue(e.target.value as ft)}
                />
            </div>
        </label>
    </XField >;
}
