// SPDX-FileCopyrightText: 2024 caixw
//
// SPDX-License-Identifier: MIT

import { JSX, mergeProps, Show } from 'solid-js';

import { Scheme } from '@/components/base';
import { Accessor } from '@/components/form';

type Value = string | number | Array<string>;

export interface Props<T> {
    scheme?: Scheme;
    icon?: string;
    label?: string;
    placeholder?: string;
    type?: 'text' | 'password' | 'url' | 'email' | 'number' | 'date';
    disabled?: boolean;
    readonly?: boolean;
    rounded?: boolean;
    accessor: Accessor<T>;
    title?: string;
}

export default function XTextField<T extends Value>(props: Props<T>):JSX.Element {
    props = mergeProps({ color: undefined }, props) as Props<T>;
    const access = props.accessor;

    return <div class={props.scheme ? `field scheme--${props.scheme}` : 'field'}>
        <label title={props.title}>
            <Show when={props.label}>
                {props.label}
            </Show>
            <div classList={{
                'text-field': true,
                'rounded-full': props.rounded,
            }}>
                <Show when={props.icon}>
                    <span role="none" class="material-symbols-outlined">{props.icon}</span>
                </Show>
                <input type={props.type}
                    disabled={props.disabled}
                    readOnly={props.readonly}
                    placeholder={props.placeholder}
                    value={access.getValue()}
                    onInput={(e) => { access.setValue(e.target.value as T); access.setError(); }}
                />
            </div>
        </label >
        <p class="field_error" role="alert">{access.getError()}</p>
    </div>;
}
