// SPDX-FileCopyrightText: 2024-2026 caixw
//
// SPDX-License-Identifier: MIT

import { createEffect, createMemo, createSignal, createUniqueId, JSX, mergeProps, Show } from 'solid-js';

import { joinClass, RefProps } from '@components/base';
import {
    Accessor, calcLayoutFieldAreas, Field, fieldArea2Style, FieldBaseProps, FieldHelpArea, useForm
} from '@components/form/field';
import { TextProps } from '@components/input/input';
import styles from './style.module.css';

export interface Ref {
    /**
     * 组件的根元素
     */
    root(): HTMLDivElement;

    /**
     * 组件中的 textarea 元素
     */
    textarea(): HTMLTextAreaElement;
}

export interface Props extends FieldBaseProps, RefProps<Ref> {
    /**
     * 最小的字符数量
     *
     * @reactive
     */
    maxLength?: number;

    /**
     * 最大的字符数量
     *
     * @reactive
     */
    minLength?: number;

    placeholder?: string;

    /**
     * NOTE: 非响应式属性
     */
    accessor: Accessor<string>;

    /**
     * 指定输入键盘的模式
     *
     * @reactive
     */
    inputMode: TextProps['inputMode'];

    /**
     * 指定显示字符串统计的格式化方法
     *
     * @remarks
     * 如果为方法，表示采用此方法格式化字符串统计内容并显示在恰当的位置，
     * 如果为 true，相当于指定了类似以下方法作为格式化方法：
     * ```ts
     * (val, max?) => `${val}/${max}`
     * ```
     * 如果为 false 或是为空表示不需要展示统计数据。
     */
    count?: boolean | { (val: number, max?: number): string; };
}

function countFormater(val: number, max?: number): string {
    return max !== undefined ? `${val}/${max}` : val.toString();
}

/**
 * 多行文本框
 *
 * @typeParam T - 文本框内容的类型
 */
export function TextArea(props: Props):JSX.Element {
    const form = useForm();
    props = mergeProps(form, props);

    const [count, setCount] = createSignal('');
    createEffect(() => {
        if (props.count) {
            const formatter = props.count === true ? countFormater : props.count;
            setCount(formatter(props.accessor.getValue()?.toString().length ?? 0, props.maxLength));
        } else {
            setCount('');
        }
    });

    let textareaRef: HTMLTextAreaElement;
    let rootRef: HTMLDivElement;
    const [helpRef, setHelpRef] = createSignal<HTMLParagraphElement | undefined>();

    const id = createUniqueId();
    const areas = createMemo(() => calcLayoutFieldAreas(props.layout!, props.hasHelp, !!props.label));



    return <Field ref={el => rootRef = el} class={joinClass(undefined, props.class, styles.ta)} style={props.style}
        title={props.title} palette={props.palette}
    >
        <Show when={areas().labelArea}>
            {area => <label style={{
                ...fieldArea2Style(area()),
                'width': props.labelWidth,
                'text-align': props.labelAlign,
            }} for={id}>{props.label}</label>}
        </Show>

        <textarea style={fieldArea2Style(areas().inputArea)} id={id} inputMode={props.inputMode}
            class={joinClass(undefined, styles.textarea, props.rounded ? styles.rounded : '')}
            tabIndex={props.tabindex} disabled={props.disabled} readOnly={props.readonly}
            placeholder={props.placeholder} value={props.accessor.getValue()}
            ref={el => {
                textareaRef = el;

                if (props.ref) {
                    props.ref({
                        root() { return rootRef; },
                        textarea() { return textareaRef; }
                    });
                }
            }}
            onInput={(e) => {
                props.accessor.setValue(e.target.value);
                props.accessor.setError();
            }}
        />

        <span class={styles.count} style={{
            'bottom': helpRef() ? `${helpRef()!.getBoundingClientRect().height}px` : '0'
        }}>{count()}</span>

        <Show when={areas().helpArea}>
            {area =>
                <FieldHelpArea ref={setHelpRef} area={area()}
                    getError={props.accessor.getError} help={props.help}
                />
            }
        </Show>
    </Field>;
}
