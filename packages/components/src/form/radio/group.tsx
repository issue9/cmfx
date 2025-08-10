// SPDX-FileCopyrightText: 2024-2025 caixw
//
// SPDX-License-Identifier: MIT

import { For, JSX, Show, createMemo, mergeProps } from 'solid-js';

import { AvailableEnumType, Layout } from '@/base';
import { Accessor, Field, FieldBaseProps, FieldHelpArea, Options, calcLayoutFieldAreas, fieldArea2Style, useFormContext } from '@/form/field';
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

    accessor: Accessor<T>;
    options: Options<T>;
}

export function RadioGroup<T extends AvailableEnumType> (props: Props<T>): JSX.Element {
    const form = useFormContext();
    props = mergeProps({
        tabindex: 0,
        itemLayout: 'horizontal' as Layout,
    }, form, props);

    const access = props.accessor;
    const areas = createMemo(() => calcLayoutFieldAreas(props.layout!, access.hasHelp(), !!props.label));

    return <Field class={props.class}
        title={props.title}
        palette={props.palette}>
        <Show when={areas().labelArea}>
            {(area)=><label style={fieldArea2Style(area())}>{props.label}</label>}
        </Show>

        <div style={fieldArea2Style(areas().inputArea)} classList={{
            [styles['group-content']]: true,
            'flex-col': props.itemLayout === 'vertical'
        }}>
            <For each={props.options}>
                {(item) =>
                    <label classList={{ [styles.block]: props.block }} tabIndex={props.tabindex}>
                        <input type="radio" class={props.block ? '!hidden' : undefined}
                            readOnly={props.readonly}
                            checked={item[0] === access.getValue()}
                            name={props.accessor.name()}
                            value={item[0]}
                            onChange={() => {
                                if (!props.readonly && !props.disabled && access.getValue() !== item[0]) {
                                    access.setValue(item[0]);
                                    access.setError();
                                }
                            }}
                        />
                        {item[1]}
                    </label>
                }
            </For>
        </div>

        <Show when={areas().helpArea}>
            {(area) => <FieldHelpArea area={area()} getError={props.accessor.getError} help={props.help} />}
        </Show>
    </Field>;
}
