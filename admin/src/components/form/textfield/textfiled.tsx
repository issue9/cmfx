// SPDX-FileCopyrightText: 2024 caixw
//
// SPDX-License-Identifier: MIT

import { JSX, mergeProps, Show } from 'solid-js';

import { Accessor, FieldBaseProps, InputMode } from '@/components/form';

type Value = string | number | Array<string>;

export interface Props<T> extends FieldBaseProps {
    prefix?: JSX.Element;
    suffix?: JSX.Element;

    placeholder?: string;
    type?: 'text' | 'url' | 'email';
    rounded?: boolean;
    accessor: Accessor<T>;
    inputMode?: InputMode;
};

export default function<T extends Value>(props: Props<T>):JSX.Element {
    props = mergeProps({ color: undefined }, props) as Props<T>;
    const access = props.accessor;

    return <div class={props.palette ? `c--field palette--${props.palette}` : 'c--field'}>
        <label title={props.title}>
            <Show when={props.label}>
                {props.label}
            </Show>
            <div classList={{
                'c--text-field': true,
                'c--text-field-rounded': props.rounded,
            }}>
                <Show when={props.prefix}>
                    <div class="prefix">{props.prefix}</div>
                </Show>
                <input accessKey={props.accessKey} class="input" type={props.type}
                    inputMode={props.inputMode}
                    tabIndex={props.tabindex}
                    disabled={props.disabled}
                    readOnly={props.readonly}
                    placeholder={props.placeholder}
                    value={access.getValue()}
                    onInput={(e) => { access.setValue(e.target.value as T); access.setError(); }}
                />
                <Show when={props.suffix}>
                    <div class="suffix">{props.suffix}</div>
                </Show>
            </div>
        </label>
        <Show when={access.hasError()}>
            <p class="field_error" role="alert">{access.getError()}</p>
        </Show>
    </div>;
}
