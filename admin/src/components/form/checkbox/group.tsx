// SPDX-FileCopyrightText: 2024-2025 caixw
//
// SPDX-License-Identifier: MIT

import { For, JSX, mergeProps, splitProps } from 'solid-js';

import { Accessor, Field, FieldBaseProps, Options } from '@/components/form/field';
import { Checkbox } from './checkbox';

export interface Props<T> extends FieldBaseProps {
    /**
     * 是否显示为块
     */
    block?: boolean;

    /**
     * 所有 checkbox 项是否横排
     */
    itemHorizontal?: boolean;

    accessor: Accessor<Array<T>>;
    options: Options<T>;
}

export function CheckboxGroup<T extends string | number>(props: Props<T>): JSX.Element {
    props = mergeProps({
        icon: true,
    }, props);

    const access = props.accessor;

    const [chkProps, _] = splitProps(props, ['disabled', 'readonly', 'tabindex', 'block']);

    return <Field class={props.class}
        inputArea={{ pos: 'middle-center' }}
        errArea={{ pos: 'bottom-center' }}
        labelArea={{ pos: props.horizontal ? 'middle-left' : 'top-center' }}
        classList={props.classList}
        hasError={access.hasError}
        getError={access.getError}
        title={props.title}
        label={props.label}
        palette={props.palette}>
        <div classList={{
            'c--checkbox-group-content': true,
            'flex-col': !props.itemHorizontal
        }}>
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
