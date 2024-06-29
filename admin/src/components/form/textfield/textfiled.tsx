// SPDX-FileCopyrightText: 2024 caixw
//
// SPDX-License-Identifier: MIT

import { createSignal, JSX, mergeProps, Show } from 'solid-js';

import { Color } from '@/components/base';
import { Form, Object } from '@/components/form';

export interface Props<T extends Object> {
    name: keyof T;
    color?: Color;
    icon?: string;
    label?: string;
    placeholder?: string;
    type?: 'text' | 'password' | 'url' | 'email';
    disabled?: boolean;
    readonly?: boolean;
    f: Form<T>;
}

export default function XTextField<T extends Object>(props: Props<T>):JSX.Element {
    type ft = T[typeof props.name];
    props = mergeProps({ color: 'primary' }, props) as Props<T>;

    const [getV,setV] = createSignal<ft>(props.f.getInitValue(props.name));
    const [getE,setE] = createSignal<string>('');

    props.f.add(props.name, {
        getValue() {
            return getV;
        },

        setValue(v: Exclude<ft,Function>) {
            setV(v);
        },

        setError(err) {
            setE(err);
        },

        reset() {
            setE('');
            setV(props.f.getInitValue(props.name));
        }
    });

    const cls = `text-field color--${props.color}`;

    return <div class="field">
        <label>
            <Show when={props.label}>
                {props.label}
            </Show>
            <div class={cls}>
                <Show when={props.icon}>
                    <span role="none" class="material-symbols-outlined">{props.icon}</span>
                </Show>
                <input type={props.type} disabled={props.disabled} readOnly={props.readonly} placeholder={props.placeholder} value={getV()} onInput={(e)=>setV(e.target.value as ft)} />
            </div>
        </label>
        <p class="error" role="alert">{getE()}</p>
    </div>;
}
