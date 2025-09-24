// SPDX-FileCopyrightText: 2024-2025 caixw
//
// SPDX-License-Identifier: MIT

import { createMemo, createSignal, createUniqueId, JSX, mergeProps, onMount, Show } from 'solid-js';

import { joinClass } from '@/base';
import {
    Accessor, AutoComplete, calcLayoutFieldAreas, Field,
    fieldArea2Style, FieldBaseProps, FieldHelpArea, InputMode, useForm
} from '@/form/field';
import { Dropdown, DropdownRef, MenuItemItem } from '@/menu';
import styles from './style.module.css';

type Value = string | number | undefined;

export type Ref = HTMLInputElement;

export interface Props<T extends Value = string> extends FieldBaseProps {
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
     * 只有在此值为 number 时，内容才会被当作数值处理。
     */
    type?: 'text' | 'url' | 'tel' | 'email' | 'number' | 'password' | 'search';

    /**
     * NOTE: 非响应式属性
     */
    accessor: Accessor<T>;

    /**
     * 键盘的输入模式
     *
     * @reactive
     */
    inputMode?: InputMode;

    /**
     * autocomplete
     *
     * @reactive
     */
    autocomplete?: AutoComplete;

    /**
     * 这是对 {@link HTMLInputElement} 对象的引用
     */
    ref?: { (el: Ref): void };

    /**
     * 提供候选词列表
     */
    onSearch?: { (text: T): Array<Exclude<T, undefined>>; };
}

/**
 * 提供了单行的输入组件
 *
 * @typeParam T - 文本框内容的类型
 */
export function TextField<T extends Value = string>(props: Props<T>):JSX.Element {
    const form = useForm();
    props = mergeProps(form, props);

    const access = props.accessor;
    const id = createUniqueId();
    const areas = createMemo(() => calcLayoutFieldAreas(props.layout!, props.hasHelp, !!props.label));
    const [candidate, setCandidate] = createSignal<Array<MenuItemItem<Exclude<T, undefined>>>>([]);

    let dropdownRef: DropdownRef;
    let triggerRef: HTMLDivElement;

    onMount(() => {
        dropdownRef.element().style.width = triggerRef.getBoundingClientRect().width + 'px';
    });

    return <Field title={props.title} palette={props.palette} class={props.class}>
        <Show when={areas().labelArea}>
            {area => <label style={fieldArea2Style(area())} for={id}>{props.label}</label>}
        </Show>

        <div style={fieldArea2Style(areas().inputArea)}>
            <Dropdown trigger='custom' items={candidate()} ref={el => dropdownRef = el}
                onChange={e => props.accessor.setValue(e)}>
                <div ref={el => triggerRef = el}
                    class={joinClass(undefined, styles['text-field'], props.rounded ? styles.rounded : '')}
                >
                    <Show when={props.prefix}>{props.prefix}</Show>
                    <input id={id} class={styles.input} type={props.type}
                        ref={el => { if (props.ref) { props.ref(el); } }} inputMode={props.inputMode}
                        autocomplete={props.autocomplete} tabIndex={props.tabindex} disabled={props.disabled}
                        readOnly={props.readonly} placeholder={props.placeholder}
                        value={access.getValue() ?? ''} // 正常处理 undefined
                        onInput={e => {
                            let v = e.target.value as T;
                            if (props.type === 'number') {
                                v = parseInt(e.target.value) as T;
                            }
                            access.setValue(v);
                            access.setError();

                            if (props.onSearch) {
                                setCandidate(props.onSearch(v).map(item => ({ type: 'item', value: item, label: item })));
                                dropdownRef.show();
                            }
                        }}
                    />
                    <Show when={props.suffix}>{props.suffix}</Show>
                </div>
            </Dropdown>
        </div>

        <Show when={areas().helpArea}>
            {area => <FieldHelpArea area={area()} getError={props.accessor.getError} help={props.help} />}
        </Show>
    </Field>;
}
