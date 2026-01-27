// SPDX-FileCopyrightText: 2025-2026 caixw
//
// SPDX-License-Identifier: MIT

import { createEffect, createSignal, JSX, Show, untrack } from 'solid-js';

import { BaseProps, joinClass, RefProps } from '@components/base';
import styles from './style.module.css';

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

interface InputBaseProps extends BaseProps, RefProps<Ref> {
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

    id?: string;
}

export interface TextProps extends InputBaseProps {
    /**
     * 内容类型
     *
     * @reactive
     */
    type?: 'button' | 'color' | 'date' | 'datetime-local' | 'email' | 'file' | 'image' | 'month'
        | 'password' | 'range' | 'reset' | 'search' | 'submit' | 'tel' | 'text' | 'time' | 'url' | 'week';

    /**
     * 键盘的输入模式
     *
     * @reactive
     */
    inputMode?: Exclude<JSX.HTMLAttributes<HTMLElement>['inputMode'], 'numeric' | 'decimal'>;

    /**
     * 值
     *
     * @reactive
     */
    value?: string;

    onChange: { (val?: string, old?: string): void; };
}
export interface NumberProps extends InputBaseProps {
    /**
     * 内容类型
     *
     * @reactive
     */
    type: 'number';

    /**
     * 键盘的输入模式
     *
     * @reactive
     */
    inputMode?: 'numeric' | 'decimal';

    /**
     * 值
     *
     * @reactive
     */
    value?: number;

    onChange: { (val?: number, old?: number): void; };
}

export type Props = TextProps | NumberProps;

/**
 * 对 input 的简单封装，主要供其它组件使用。是 Search 和 TextField 的基础。
 *
 * @typeParam T - 文本框内容的类型；
 */
export function Input(props: Props): JSX.Element {
    let rootRef: HTMLDivElement;
    const [value, setValue] = createSignal(props.value);

    createEffect(() => setValue(props.value));

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
                const curr = e.currentTarget.value;
                const old = untrack(value);

                if (props.type === 'number') {
                    if (props.onChange) { props.onChange(parseInt(curr) as any, old as any); }
                } else {
                    if (props.onChange) { props.onChange(curr as any, old as any); }
                }
                setValue(curr); // 要放在 onChange 之后
            }}
        />

        <Show when={props.suffix}>{c => { return c(); }}</Show>
    </div>;
}
