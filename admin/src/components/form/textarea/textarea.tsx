// SPDX-FileCopyrightText: 2024 caixw
//
// SPDX-License-Identifier: MIT

import { JSX, mergeProps, Show } from 'solid-js';

import { Color } from '@/components/base';
import { Accessor } from '@/components/form';

export interface Props<T> {
    color?: Color;
    label?: string;
    placeholder?: string;
    disabled?: boolean;
    readonly?: boolean;
    accessor: Accessor<T>;
    title?: string;
}

export default function XTextField<T extends string|number|Array<string>>(props: Props<T>):JSX.Element {
    props = mergeProps({type:'text'}, props) as Props<T>; // 指定默认值
    const access = props.accessor;

    return <div class={props.color ? `field scheme--${props.color}` : 'field'}>
        <label title={props.title}>
            <Show when={props.label}>
                {props.label}
            </Show>
            <textarea class="textarea" disabled={props.disabled} readOnly={props.readonly} placeholder={props.placeholder}
                value={access.getValue()}
                onInput={(e) => { access.setValue(e.target.value as T); access.setError(); }} />
        </label>
        <p class="field_error" role="alert">{access.getError()}</p>
    </div>;
}
