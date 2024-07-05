// SPDX-FileCopyrightText: 2024 caixw
//
// SPDX-License-Identifier: MIT

import { JSX, mergeProps, Show } from 'solid-js';

import { Color } from '@/components/base';
import { Accessor } from '@/components/form';

export interface Props<T> {
    color?: Color;
    icon?: string;
    label?: string;
    placeholder?: string;
    type?: 'text' | 'password' | 'url' | 'email' | 'number' | 'date';
    disabled?: boolean;
    readonly?: boolean;
    rounded?: boolean;
    accessor: Accessor<T>;
}

export default function XTextField<T extends string|number|Array<string>>(props: Props<T>):JSX.Element {
    props = mergeProps({ color: 'primary' }, props) as Props<T>;
    const access = props.accessor;

    return <div class="field">
        <label>
            <Show when={props.label}>
                {props.label}
            </Show>
            <div classList={{
                'text-field': true,
                [`scheme--${props.color}`]: true,
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
        </label>
        <p class="field_error" role="alert">{access.getError()}</p>
    </div>;
}
