// SPDX-FileCopyrightText: 2024-2025 caixw
//
// SPDX-License-Identifier: MIT

import { createSignal, For } from 'solid-js';

import { AvailableEnumType, BaseProps, Layout } from '@/base';
import { Button, ButtonGroup } from '@/button';
import { FieldOptions } from '@/form';
import { ChangeFunc } from '@/form/field';

export interface Props<T extends AvailableEnumType> extends BaseProps {
    rounded?: boolean;

    disabled?: boolean;

    /**
     * 应用在根元素的类名
     */
    class?: string;

    items: FieldOptions<T>;

    layout?: Layout;

    /**
     * 默认选中的值，如果为空，则选中第一个项。
     */
    value?: T;

    /**
     * 非响应属性
     */
    onChange?: ChangeFunc<T>;
}

export function Tab<T extends AvailableEnumType>(props: Props<T>) {
    const [val, setVal] = createSignal<T>(props.value ?? props.items[0][0]);

    const change = (v: T, old?: T): void => {
        if (props.onChange) { props.onChange(v, old); }
        setVal(() => v);
    };

    return <ButtonGroup class={props.class} rounded={props.rounded}
        disabled={props.disabled} layout={props.layout}
    >
        <For each={props.items}>
            {item => (
                <Button checked={val() == item[0]} onClick={() => { change(item[0], props.value); }}>
                    {item[1]}
                </Button>
            )}
        </For>
    </ButtonGroup>;
}
