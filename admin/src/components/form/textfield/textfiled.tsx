// SPDX-FileCopyrightText: 2024-2025 caixw
//
// SPDX-License-Identifier: MIT

import { JSX, mergeProps, Show } from 'solid-js';

import { Accessor, AutoComplete, FieldProps, InputMode } from '@/components/form/field';

type Value = string | number | Array<string>;

export type Ref = HTMLInputElement;

export interface Props<T> extends FieldProps {
    /**
     * 文本框内顶部的内容
     */
    prefix?: JSX.Element;

    /**
     * 文本框内尾部的内容
     */
    suffix?: JSX.Element;

    placeholder?: string;
    
    /**
     * 内容类型
     *
     * 只有在此值为 number 时，内容才会被当作数值处理。
     */
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
export function TextField<T extends Value>(props: Props<T>):JSX.Element {
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
                    onInput={(e) => {
                        let v = e.target.value as T;
                        if (props.type === 'number') {
                            v = parseInt(e.target.value) as T;
                        }
                        access.setValue(v);
                        access.setError(); 
                    }}
                />
                <Show when={props.suffix}>{props.suffix}</Show>
            </div>
        </label>
        <Show when={access.hasError()}>
            <p class="field_error" role="alert">{access.getError()}</p>
        </Show>
    </div>;
}
