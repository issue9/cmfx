// SPDX-FileCopyrightText: 2024-2025 caixw
//
// SPDX-License-Identifier: MIT

import {
    createEffect, createMemo, createSignal, createUniqueId, JSX, Match, mergeProps, onCleanup, onMount, Show, Switch
} from 'solid-js';

import { BaseProps, RefProps, style2String } from '@/base';
import {
    Accessor, calcLayoutFieldAreas, Field, fieldArea2Style, FieldBaseProps, FieldHelpArea, useForm
} from '@/form/field';
import { AutoComplete, Input, InputMode, InputRef, InputValue } from '@/input';
import { Dropdown, DropdownRef, MenuItemItem } from '@/menu';

export type Ref = InputRef;

export interface Props<T extends InputValue = string> extends FieldBaseProps, RefProps<Ref> {
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
     * @remarks 只有在此值为 number 时，内容才会被当作数值处理。
     */
    type?: 'text' | 'url' | 'tel' | 'email' | 'number' | 'password' | 'search';

    /**
     * NOTE: 非响应式属性
     */
    accessor: Accessor<T | undefined>;

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
     * @remarks
     * 当前此属性不为空时，每次的输入都会触发此方法，并将其返回值作为候选列表展示。
     */
    onSearch?: { (text?: T): Array<Exclude<T, undefined>>; };
}

/**
 * 提供了单行的输入组件
 *
 * @typeParam T - 文本框内容的类型
 */
export function TextField<T extends InputValue = string>(props: Props<T>):JSX.Element {
    const form = useForm();
    props = mergeProps(form, props);

    const id = createUniqueId();
    const areas = createMemo(() => calcLayoutFieldAreas(props.layout!, props.hasHelp, !!props.label));
    const [candidate, setCandidate] = createSignal<Array<MenuItemItem<Exclude<T, undefined>>>>([]);

    let dropdownRef: DropdownRef;
    let rootRef: HTMLDivElement;

    onMount(() => {
        if (dropdownRef) {
            const click = (e: MouseEvent) => {
                if (!dropdownRef.root().contains(e.target as HTMLElement)) {
                    dropdownRef.hide();
                }
            };

            document.addEventListener('click', click);
            onCleanup(() => { document.removeEventListener('click', click); });
        }
    });

    const Trigger = (p: { style?: BaseProps['style'] }) => {
        let inputRef: InputRef;
        createEffect(() => { inputRef.root().style = style2String(p.style); });

        return <Input id={id} prefix={props.prefix} suffix={props.suffix} rounded={props.rounded}
            inputMode={props.inputMode} autocomplete={props.autocomplete}
            tabindex={props.tabindex} disabled={props.disabled}
            readonly={props.readonly} placeholder={props.placeholder}
            value={props.accessor.getValue()} onChange={v => {
                props.accessor.setValue(v);
                props.accessor.setError();

                if (props.onSearch) {
                    setCandidate(props.onSearch(v).map(item => ({ type: 'item', value: item, label: item })));
                    dropdownRef.show();
                }
            }} ref={el => {
                inputRef = el;
                if (props.ref) {
                    props.ref({
                        root: () => rootRef,
                        input: () => el.input(),
                    });
                }
            }}
        />;
    };

    return <Field title={props.title} ref={el => rootRef = el}
        palette={props.palette} class={props.class} style={props.style}
    >
        <Show when={areas().labelArea}>
            {area => <label style={{
                ...fieldArea2Style(area()),
                'width': props.labelWidth,
                'text-align': props.labelAlign,
            }} for={id}>{props.label}</label>}
        </Show>

        <Switch fallback={<Trigger style={fieldArea2Style(areas().inputArea)} />}>
            <Match when={props.onSearch}>
                <div style={fieldArea2Style(areas().inputArea)} class="w-full">
                    <Dropdown trigger='custom' items={candidate()} ref={el => {
                        dropdownRef = el;
                        const style = dropdownRef.menu().root().style;
                        style.height = '240px';
                        style.overflowY = 'auto';
                    }} onPopover={visible => {
                        if (visible) {
                            dropdownRef.menu().root().style.width
                                = dropdownRef.root().getBoundingClientRect().width + 'px';
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
