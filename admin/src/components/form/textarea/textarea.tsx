// SPDX-FileCopyrightText: 2024-2025 caixw
//
// SPDX-License-Identifier: MIT

import { JSX, mergeProps, Show } from 'solid-js';

import { Accessor, FieldProps, InputMode } from '@/components/form/field';

type Value = string | number | Array<string>;

export interface Props<T> extends FieldProps {
    placeholder?: string;
    accessor: Accessor<T>;
    inputMode?: InputMode;
}

export function TextArea<T extends Value>(props: Props<T>):JSX.Element {
    props = mergeProps({type:'text'}, props) as Props<T>; // 指定默认值
    const access = props.accessor;

    return <div class={props.class} classList={{
        ...props.classList,
        'c--field': true,
        [`c--field palette--${props.palette}`]: !!props.palette,
    }}>
        <label title={props.title}>
            <Show when={props.label}>
                {props.label}
            </Show>
            <textarea accessKey={props.accessKey} class="c--textarea" inputMode={props.inputMode} tabIndex={props.tabindex} disabled={props.disabled} readOnly={props.readonly} placeholder={props.placeholder}
                value={access.getValue()}
                onInput={(e) => { access.setValue(e.target.value as T); access.setError(); }} />
        </label>
        <Show when={access.hasError()}>
            <p class="field_error" role="alert">{access.getError()}</p>
        </Show>
    </div>;
}
