// SPDX-FileCopyrightText: 2024 caixw
//
// SPDX-License-Identifier: MIT

import { For, mergeProps, Show, splitProps } from 'solid-js';

import { Accessor, FieldBaseProps, Options } from '@/components/form';
import { IconSymbol } from '@/components/icon';
import { Checkbox } from './checkbox';

export interface Props<T> extends FieldBaseProps {
    /**
     * 是否显示为块
     */
    block?: boolean;

    vertical?: boolean;
    accessor: Accessor<Array<T>>;
    options: Options<T>;

    checkedIcon?: IconSymbol;
    uncheckedIcon?: IconSymbol;
    indeterminateIcon?: IconSymbol;
}

export function CheckboxGroup<T extends string | number> (props: Props<T>) {
    props = mergeProps({
        icon: true,
        checkedIcon: 'check_box' as IconSymbol,
        uncheckedIcon: 'check_box_outline_blank' as IconSymbol,
        indeterminateIcon: 'indeterminate_check_box' as IconSymbol
    }, props);
    const access = props.accessor;

    const [chkProps, _] = splitProps(props, ['disabled', 'tabindex', 'readonly', 'block', 'checkedIcon', 'uncheckedIcon', 'indeterminateIcon','classList', 'class']);

    return <fieldset accessKey={props.accessKey} tabIndex={props.tabindex} disabled={props.disabled} classList={{
        ...props.classList,
        'c--checkbox-group': true,
        'c--field': true,
        [`palette--${props.palette}`]: !!props.palette
    }}>
        <Show when={props.label}>
            <legend class="flex items-center w-full" title={props.title}>{props.label}</legend >
        </Show>

        <div classList={{
            'content': true,
            'flex-col': props.vertical
        }}>
            <For each={props.options}>
                {(item) =>
                    <Checkbox {...chkProps} label={item[1]}
                        checked={!!access.getValue().find((v)=>v===item[0])}
                        onChange={(v)=>{
                            if (v) {
                                access.setValue([...access.getValue(), item[0]]);
                            } else {
                                access.setValue([...access.getValue().filter((v)=>v!==item[0])]);
                            }
                            access.setError();
                        }}
                    />
                }
            </For>
        </div>
        <Show when={access.hasError()}>
            <p class="field_error" role="alert">{access.getError()}</p>
        </Show>
    </fieldset>;
}
