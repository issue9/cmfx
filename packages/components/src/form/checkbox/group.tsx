// SPDX-FileCopyrightText: 2024-2025 caixw
//
// SPDX-License-Identifier: MIT

import { For, JSX, Show, createMemo, mergeProps, splitProps } from 'solid-js';

import { AvailableEnumType, Layout, joinClass } from '@/base';
import { Accessor, Field, FieldBaseProps, FieldHelpArea, Options, calcLayoutFieldAreas, fieldArea2Style } from '@/form/field';
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

    accessor: Accessor<Array<T>>;
    options: Options<T>;
}

export function CheckboxGroup<T extends string | number>(props: Props<T>): JSX.Element {
    props = mergeProps({
        icon: true,
        layout: 'horizontal' as Layout,
        itemLayout: 'horizontal' as Layout,
    }, props);

    const access = props.accessor;

    const [chkProps, _] = splitProps(props, ['disabled', 'readonly', 'tabindex', 'block']);
    const areas = createMemo(() => calcLayoutFieldAreas(props.layout!, access.hasHelp(), !!props.label));

    return <Field class={props.class}
        {...calcLayoutFieldAreas(props.layout!, access.hasHelp(), !!props.label)}
        title={props.title}
        palette={props.palette}>
        <Show when={areas().labelArea}>
            {(area) => <label style={fieldArea2Style(area())}>{props.label}</label>}
        </Show>

        <div style={fieldArea2Style(areas().inputArea)}
            class={joinClass(styles['group-content'], props.itemLayout === 'vertical' ? 'flex-col' : undefined)}
        >
            <For each={props.options}>
                {(item) =>
                    <Checkbox {...chkProps} label={item[1]} checked={!!access.getValue().find((v) => v === item[0])}
                        onChange={(v) => {
                            if (v) {
                                access.setValue([...access.getValue(), item[0]]);
                            } else {
                                access.setValue([...access.getValue().filter((v) => v !== item[0])]);
                            }
                            access.setError();
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
