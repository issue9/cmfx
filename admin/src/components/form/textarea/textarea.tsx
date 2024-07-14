// SPDX-FileCopyrightText: 2024 caixw
//
// SPDX-License-Identifier: MIT

import { JSX, mergeProps, Show } from 'solid-js';

import { Accessor, FieldBaseProps } from '@/components/form';

type Value = string | number | Array<string>;

export interface Props<T> extends FieldBaseProps {
    placeholder?: string;
    accessor: Accessor<T>;
};

export default function<T extends Value>(props: Props<T>):JSX.Element {
    props = mergeProps({type:'text'}, props) as Props<T>; // 指定默认值
    const access = props.accessor;

    return <div class={props.scheme ? `field scheme--${props.scheme}` : 'field'}>
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
