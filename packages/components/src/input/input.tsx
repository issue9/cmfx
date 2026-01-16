// SPDX-FileCopyrightText: 2025-2026 caixw
//
// SPDX-License-Identifier: MIT

import { createEffect, createSignal, JSX, Show, untrack } from 'solid-js';

import { BaseProps, joinClass, RefProps } from '@/base';
import styles from './style.module.css';

export type Value = string | number;

/**
 * input 组件的 inputMode 属性的可选值
 */
export type Mode = JSX.HTMLAttributes<HTMLElement>['inputMode'];

/**
 * input 组件的 autoComplete 属性
 */
export type AutoComplete = JSX.HTMLAutocomplete;

export interface Ref {
    /**
     * 组件的根元素
     */
    root(): HTMLDivElement;

    /**
     * 组件中实际用于输入的 input 元素
     */
    input(): HTMLInputElement;
}

export interface Props<T extends Value = string> extends BaseProps, RefProps<Ref> {
    /**
     * 文本框内顶部的内容
     *
     * @reactive
     */
    prefix?: JSX.Element;

    /**
     * 文本框内尾部的内容
     *
     * @reactive
     */
    suffix?: JSX.Element;

    /**
     * placeholder
     *
     * @reactive
     */
    placeholder?: string;

    /**
     * 内容类型
     *
     * @remarks
     * 只有在此值为 number 时，内容才会被当作数值处理。
     */
    type?: Exclude<JSX.InputHTMLAttributes<HTMLInputElement>['type'], 'checkbox' | 'radio' | 'hidden'>;

    /**
     * 键盘的输入模式
     *
     * @reactive
     */
    inputMode?: Mode;

    /**
     * autocomplete
     *
     * @reactive
     */
    autocomplete?: AutoComplete;

    /**
     * 是否为圆角
     *
     * @reactive
     */
    rounded?: boolean;

    tabindex?: number;

    /**
     * 只读
     *
     * @reactive
     */
    readonly?: boolean;

    /**
     * 禁用状态
     *
     * @reactive
     */
    disabled?: boolean;

    /**
     * 值
     *
     * @reactive
     */
    value?: T;

    id?: string;

    onChange(val?: T, old?: T): void;
}

/**
 * 对 input 的简单封装，主要供其它组件使用。是 Search 和 TextField 的基础。
 *
 * @typeParam T - 文本框内容的类型；
 */
export function Input<T extends Value = string>(props: Props<T>):JSX.Element {
    let rootRef: HTMLDivElement;
    const [value, setValue] = createSignal<T | undefined>(props.value);

    createEffect(() => setValue(() => props.value));

    return <div ref={el => rootRef = el}
        class={joinClass(props.palette, styles.input, props.rounded ? styles.rounded : '', props.class)}
        style={props.style}
    >
        <Show when={props.prefix}>{c => { return c(); }}</Show>

        <input id={props.id} type={props.type} value={value() ?? ''} // 正常处理 undefined
            inputMode={props.inputMode} autocomplete={props.autocomplete}
            tabIndex={props.tabindex} disabled={props.disabled}
            readOnly={props.readonly} placeholder={props.placeholder} ref={el => {
                if (props.ref) {
                    props.ref({
                        root: () => rootRef,
                        input: () => el,
                    });
                }
            }} onInput={e => {
                let v: Value = e.currentTarget.value;
                if (props.type === 'number') { v = parseInt(v); }

                if (props.onChange) { props.onChange(v as T, untrack(value)); }

                setValue(() => v as T); // 要放在 onChange 之后
            }}
        />

        <Show when={props.suffix}>{c => { return c(); }}</Show>
    </div>;
}
