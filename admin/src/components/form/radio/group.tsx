// SPDX-FileCopyrightText: 2024-2025 caixw
//
// SPDX-License-Identifier: MIT

import { For, JSX, mergeProps } from 'solid-js';

import { Accessor, Field, FieldBaseProps, Options } from '@/components/form/field';

export interface Props<T> extends FieldBaseProps {
    /**
     * 是否显示为块
     */
    block?: boolean;

    accessor: Accessor<T>;
    options: Options<T>;
}

export function RadioGroup<T extends string | number | undefined> (props: Props<T>): JSX.Element {
    props = mergeProps({
        tabindex: 0,
    }, props);
    const access = props.accessor;
    
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
            'c--radio-group-content': true,
            'flex': true,
            'flex-col': !props.horizontal
        }}>
            <For each={props.options}>
                {(item) =>
                    <label classList={{ 'border': props.block }} tabIndex={props.tabindex} accessKey={props.accessKey}>
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
