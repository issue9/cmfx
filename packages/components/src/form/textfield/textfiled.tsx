// SPDX-FileCopyrightText: 2024-2025 caixw
//
// SPDX-License-Identifier: MIT

import { createUniqueId, JSX, mergeProps, Show } from 'solid-js';

import { classList, Layout } from '@/base';
import { Accessor, AutoComplete, calcLayoutFieldAreas, Field, FieldBaseProps, InputMode } from '@/form/field';
import styles from './style.module.css';

type Value = string | number | Array<string> | undefined;

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

    ref?: { (el: Ref): void };
}

/**
 * 提供了单行的输入组件
 *
 * @template T 文本框内容的类型
 */
export function TextField<T extends Value>(props: Props<T>):JSX.Element {
    props = mergeProps({
        color: undefined,
        layout: 'horizontal' as Layout,
    }, props) as Props<T>;
    const access = props.accessor;
    const id = createUniqueId();

    return <Field class={classList(props.classList, props.class)}
        {...calcLayoutFieldAreas(props.layout!)}
        help={props.help}
        hasHelp={access.hasHelp}
        getError={access.getError}
        title={props.title}
        label={<label for={id}>{props.label}</label>}
        palette={props.palette}>
        <div classList={{
            [styles['text-field']]: true,
            [styles.rounded]: props.rounded,
        }}>
            <Show when={props.prefix}>{props.prefix}</Show>
            <input id={id} class={styles.input} type={props.type}
                ref={el => { if (props.ref) { props.ref(el); } }}
                inputMode={props.inputMode}
                autocomplete={props.autocomplete}
                aria-autocomplete={props['aria-autocomplete']}
                tabIndex={props.tabindex}
                disabled={props.disabled}
                readOnly={props.readonly}
                placeholder={props.placeholder}
                value={access.getValue() ?? ''} // 正常处理 undefined
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
    </Field>;
}
