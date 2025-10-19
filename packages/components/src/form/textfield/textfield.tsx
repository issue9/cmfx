// SPDX-FileCopyrightText: 2024-2025 caixw
//
// SPDX-License-Identifier: MIT

import { createMemo, createSignal, createUniqueId, JSX, Match, mergeProps, Show, Switch } from 'solid-js';

import { joinClass, RefProps } from '@/base';
import {
    Accessor, AutoComplete, calcLayoutFieldAreas, Field,
    fieldArea2Style, FieldBaseProps, FieldHelpArea, InputMode, useForm
} from '@/form/field';
import { Dropdown, DropdownRef, MenuItemItem } from '@/menu';
import styles from './style.module.css';

type Value = string | number | undefined;

export interface Ref {
    /**
     * 组件的根元素
     */
    element(): HTMLDivElement;

    /**
     * 组件中实际用于输入的 input 元素
     */
    input(): HTMLInputElement;
}

export interface Props<T extends Value = string> extends FieldBaseProps, RefProps<Ref> {
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
     * 提供候选词列表
     *
     * @remarks 当前此属性不为空时，每次的输入都会触发此方法，并将其返回值作为候选列表展示。
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

    let rootRef: HTMLDivElement;
    let dropdownRef: DropdownRef;

    const Trigger = (p: {style?: JSX.CSSProperties}) => {
        return <div style={p.style}
            class={joinClass(undefined, styles['text-field'], props.rounded ? styles.rounded : '')}
        >
            <Show when={props.prefix}>{c => { return c(); }}</Show>
            <input id={id} class={styles.input} type={props.type}
                inputMode={props.inputMode} autocomplete={props.autocomplete}
                tabIndex={props.tabindex} disabled={props.disabled}
                readOnly={props.readonly} placeholder={props.placeholder}
                value={access.getValue() ?? ''} // 正常处理 undefined
                ref={el => {
                    if (props.ref) {
                        props.ref({
                            element: () => rootRef,
                            input: () => el,
                        });
                    }
                }} onInput={e => {
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
            <Show when={props.suffix}>{c => { return c(); }}</Show>
        </div>;
    };

    return <Field title={props.title} ref={el => rootRef = el} palette={props.palette} class={props.class}>
        <Show when={areas().labelArea}>
            {area => <label style={fieldArea2Style(area())} for={id}>{props.label}</label>}
        </Show>

        <Switch fallback={<Trigger style={fieldArea2Style(areas().inputArea)} />}>
            <Match when={props.onSearch}>
                <div style={fieldArea2Style(areas().inputArea)} class="w-full">
                    <Dropdown trigger='custom' items={candidate()} ref={el => {
                        dropdownRef = el;
                        const style = dropdownRef.menu().element().style;
                        style.height = '240px';
                        style.overflowY = 'auto';
                    }} onPopover={visible => {
                        if (visible) {
                            dropdownRef.menu().element().style.width
                                = dropdownRef.element().getBoundingClientRect().width + 'px';
                        }
                        return false;
                    }} onChange={e => { props.accessor.setValue(e); }}>
                        <Trigger />
                    </Dropdown>
                </div>
            </Match>
        </Switch>

        <Show when={areas().helpArea}>
            {area => <FieldHelpArea area={area()} getError={props.accessor.getError} help={props.help} />}
        </Show>
    </Field>;
}
