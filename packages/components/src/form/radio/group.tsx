// SPDX-FileCopyrightText: 2024-2025 caixw
//
// SPDX-License-Identifier: MIT

import { For, JSX, Show, createMemo, mergeProps } from 'solid-js';

import { AvailableEnumType, Layout } from '@/base';
import { Accessor, Field, FieldBaseProps, FieldHelpArea, Options, calcLayoutFieldAreas, fieldArea2Style, useFormContext } from '@/form/field';
import { Radio } from './radio';
import styles from './style.module.css';

export interface Props<T extends AvailableEnumType> extends FieldBaseProps {
    /**
     * 是否显示为块
     */
    block?: boolean;

    /**
     * 所有 checkbox 项的布局
     */
    itemLayout?: Layout;

    /**
     * NOTE: 非响应式属性
     */
    accessor: Accessor<T>;

    options: Options<T>;
}

export function RadioGroup<T extends AvailableEnumType> (props: Props<T>): JSX.Element {
    const form = useFormContext();
    props = mergeProps({ tabindex: 0 }, form, props);

    const areas = createMemo(() => calcLayoutFieldAreas(props.layout!, props.hasHelp, !!props.label));

    const access = props.accessor;
    return <Field class={props.class} title={props.title} palette={props.palette}>
        <Show when={areas().labelArea}>
            {area => <label style={fieldArea2Style(area())}>{props.label}</label>}
        </Show>

        <div style={fieldArea2Style(areas().inputArea)} classList={{
            [styles['group-content']]: true,
            'flex-col': props.itemLayout === 'vertical'
        }}>
            <For each={props.options}>
                {item =>
                    <Radio readonly={props.readonly} label={item[1]} block={props.block}
                        checked={item[0] === access.getValue()} rounded={props.rounded} value={access.getValue()}
                        name={props.accessor.name()} onChange={() => {
                            if (!props.readonly && !props.disabled && access.getValue() !== item[0]) {
                                access.setValue(item[0]);
                                access.setError();
                            }
                        }}
                    />
                }
            </For>
        </div>

        <Show when={areas().helpArea}>
            {(area) => <FieldHelpArea area={area()} getError={props.accessor.getError} help={props.help} />}
        </Show>
    </Field>;
}
