// SPDX-FileCopyrightText: 2024 caixw
//
// SPDX-License-Identifier: MIT

import { JSX, mergeProps, Show } from 'solid-js';

import { ElementProp, renderElementProp } from '@/components/base';
import { Accessor, FieldBaseProps } from '@/components/form';

type Value = string | number | Array<string>;

export interface Props<T> extends FieldBaseProps {
    prefix?: ElementProp;
    suffix?: ElementProp;

    placeholder?: string;
    type?: 'text' | 'url' | 'email';
    rounded?: boolean;
    accessor: Accessor<T>;
};

export default function<T extends Value>(props: Props<T>):JSX.Element {
    props = mergeProps({ color: undefined }, props) as Props<T>;
    const access = props.accessor;

    return <div class={props.palette ? `field palette--${props.palette}` : 'field'}>
        <label title={props.title}>
            <Show when={props.label}>
                {renderElementProp(props.label)}
            </Show>
            <div classList={{
                'c--text-field': true,
                'rounded': props.rounded,
            }}>
                <Show when={props.prefix}>
                    <div class="prefix">{renderElementProp(props.prefix)}</div>
                </Show>
                <input class="input" type={props.type}
                    disabled={props.disabled}
                    readOnly={props.readonly}
                    placeholder={props.placeholder}
                    value={access.getValue()}
                    onInput={(e) => { access.setValue(e.target.value as T); access.setError(); }}
                />
                <Show when={props.suffix}>
                    <div class="suffix">{renderElementProp(props.suffix)}</div>
                </Show>
            </div>
        </label>
        <Show when={access.hasError()}>
            <p class="field_error" role="alert">{access.getError()}</p>
        </Show>
    </div>;
}
