// SPDX-FileCopyrightText: 2024 caixw
//
// SPDX-License-Identifier: MIT

import { JSX, mergeProps, Show } from 'solid-js';

import { Accessor } from '@/components/form/access';
import { AutoComplete, Props as FieldBaseProps, InputMode } from '@/components/form/types';

type Value = string | number | Array<string>;

export type Ref = HTMLInputElement;

export interface Props<T> extends FieldBaseProps {
    /**
     * 文本框内顶部的内容
     */
    prefix?: JSX.Element;

    /**
     * 文本框内尾部的内容
     */
    suffix?: JSX.Element;

    placeholder?: string;
    type?: 'text' | 'url' | 'tel' | 'email' | 'number' | 'password' | 'search';
    rounded?: boolean;
    accessor: Accessor<T>;
    inputMode?: InputMode;
    autocomplete?: AutoComplete;
    'aria-autocomplete'?: JSX.FormHTMLAttributes<HTMLInputElement>['aria-autocomplete'];

    ref?: {(el: Ref):void};
}

/**
 * 提供了单行的输入组件
 */
export default function<T extends Value>(props: Props<T>):JSX.Element {
    props = mergeProps({ color: undefined }, props) as Props<T>;
    const access = props.accessor;

    return <div class={props.class} classList={{
        ...props.classList,
        'c--field': true,
        [`c--field palette--${props.palette}`]: !!props.palette
    }}>
        <label title={props.title}>
            <Show when={props.label}>
                {props.label}
            </Show>
            <div classList={{
                'c--text-field': true,
                'c--text-field-rounded': props.rounded,
            }}>
                <Show when={props.prefix}>{props.prefix}</Show>
                <input accessKey={props.accessKey} class="input" type={props.type}
                    ref={el => { if (props.ref) { props.ref(el); }}}
                    inputMode={props.inputMode}
                    autocomplete={props.autocomplete}
                    aria-autocomplete={props['aria-autocomplete']}
                    tabIndex={props.tabindex}
                    disabled={props.disabled}
                    readOnly={props.readonly}
                    placeholder={props.placeholder}
                    value={access.getValue()}
                    onInput={(e) => { access.setValue(e.target.value as T); access.setError(); }}
                />
                <Show when={props.suffix}>{props.suffix}</Show>
            </div>
        </label>
        <Show when={access.hasError()}>
            <p class="field_error" role="alert">{access.getError()}</p>
        </Show>
    </div>;
}
