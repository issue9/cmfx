// SPDX-FileCopyrightText: 2024 caixw
//
// SPDX-License-Identifier: MIT

import { For, mergeProps, Show, splitProps } from 'solid-js';

import { Accessor, FieldBaseProps, Options } from '@/components/form';
import { default as XCheckbox } from './checkbox';

export type Props<T> = {
    /**
     * 是否需要显示多选按钮的图标
     */
    icon?: boolean;

    vertical?: boolean;
    accessor: Accessor<Array<T>>;
    options: Options<T>;

    checkedIcon?: string;
    uncheckedIcon?: string;
    indeterminateIcon?: string;
} & FieldBaseProps;

export default function Group<T extends string | number> (props: Props<T>) {
    props = mergeProps({
        icon: true,
        checkedIcon: 'check_box',
        uncheckedIcon: 'check_box_outline_blank',
        indeterminateIcon: 'indeterminate_check_box'
    }, props);
    const access = props.accessor;

    const [chkProps, _] = splitProps(props, ['disabled', 'readonly', 'icon', 'checkedIcon', 'uncheckedIcon', 'indeterminateIcon']);

    return <fieldset disabled={props.disabled} class={props.scheme ? `chk-group field scheme--${props.scheme}` : 'chk-group field'}>
        <Show when={props.label}>
            <legend class="icon-container" title={props.title}>{props.label}</legend >
        </Show>

        <div classList={{
            'content': true,
            'flex-col': props.vertical
        }}>
            <For each={props.options}>
                {(item) =>
                    <XCheckbox {...chkProps} label={item[1]}
                        checked={access.getValue().find((v)=>v===item[0]) ? true : false}
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
        <p class="field_error" role="alert">{access.getError()}</p>
    </fieldset>;
}
