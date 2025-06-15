// SPDX-FileCopyrightText: 2024-2025 caixw
//
// SPDX-License-Identifier: MIT

import { For, JSX, mergeProps } from 'solid-js';

import { AvailableEnumType, Layout } from '@/base';
import { Accessor, calcLayoutFieldAreas, Field, FieldBaseProps, Options } from '@/form/field';
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
    props = mergeProps({
        tabindex: 0,
        layout: 'horizontal' as Layout,
        itemLayout: 'horizontal' as Layout,
    }, props);
    const access = props.accessor;
    
    return <Field class={props.class}
        {...calcLayoutFieldAreas(props.layout!)}
        help={props.help}
        hasHelp={access.hasHelp}
        getError={access.getError}
        title={props.title}
        label={props.label}
        palette={props.palette}>
        <div classList={{
            [styles['group-content']]: true,
            'flex-col': props.itemLayout === 'vertical'
        }}>
            <For each={props.options}>
                {(item) =>
                    <label classList={{ [styles.border]: props.block }} tabIndex={props.tabindex}>
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
    </Field>;
}
