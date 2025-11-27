// SPDX-FileCopyrightText: 2024-2025 caixw
//
// SPDX-License-Identifier: MIT

import { For, JSX, Show, createMemo, mergeProps, splitProps } from 'solid-js';

import { AvailableEnumType, Layout, joinClass } from '@/base';
import {
    Accessor, Field, FieldBaseProps, FieldHelpArea, Options, calcLayoutFieldAreas, fieldArea2Style, useForm
} from '@/form/field';
import { Checkbox } from './checkbox';
import styles from './style.module.css';

export interface Props<T extends AvailableEnumType> extends FieldBaseProps {
    /**
     * 是否显示为块
     */
    block?: boolean;

    /**
     * 子项的布局方式
     */
    itemLayout?: Layout;

    /**
     * NOTE: 非响应式属性
     */
    accessor: Accessor<Array<T>>;

    options: Options<T>;
}

export function CheckboxGroup<T extends string | number>(props: Props<T>): JSX.Element {
    const form = useForm();
    props = mergeProps(form, props);

    const [chkProps, _] = splitProps(props, ['disabled', 'readonly', 'tabindex', 'block', 'rounded']);
    const areas = createMemo(() => calcLayoutFieldAreas(props.layout!, !!props.hasHelp, !!props.label));

    const access = props.accessor;
    return <Field class={props.class} title={props.title} palette={props.palette} style={props.style}>
        <Show when={areas().labelArea}>
            {area => <label style={{
                ...fieldArea2Style(area()),
                'width': props.labelWidth,
                'text-align': props.labelAlign,
            }}>{props.label}</label>}
        </Show>

        <div style={fieldArea2Style(areas().inputArea)}
            class={joinClass(undefined, styles['group-content'], props.itemLayout === 'vertical' ? 'flex-col' : '')}
        >
            <For each={props.options}>
                {item =>
                    <Checkbox {...chkProps} label={item.label} rounded={props.rounded}
                        checked={!!access.getValue().find((v) => v === item.value)}
                        onChange={(v) => {
                            if (v) {
                                access.setValue([...access.getValue(), item.value]);
                            } else {
                                access.setValue([...access.getValue().filter((v) => v !== item.value)]);
                            }
                            access.setError();
                        }}
                    />
                }
            </For>
        </div>

        <Show when={areas().helpArea}>
            {area => <FieldHelpArea area={area()} getError={props.accessor.getError} help={props.help} />}
        </Show>
    </Field>;
}
