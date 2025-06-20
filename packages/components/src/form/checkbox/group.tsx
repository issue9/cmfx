// SPDX-FileCopyrightText: 2024-2025 caixw
//
// SPDX-License-Identifier: MIT

import { For, JSX, mergeProps, splitProps } from 'solid-js';

import { AvailableEnumType, joinClass, Layout } from '@/base';
import { Accessor, calcLayoutFieldAreas, Field, FieldBaseProps, Options } from '@/form/field';
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

    return <Field class={props.class}
        {...calcLayoutFieldAreas(props.layout!, access.hasHelp(), !!props.label)}
        help={props.help}
        getError={access.getError}
        title={props.title}
        label={props.label}
        palette={props.palette}>
        <div class={joinClass(styles['group-content'], props.itemLayout === 'vertical' ? 'flex-col' : undefined)}>
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
    </Field>;
}
