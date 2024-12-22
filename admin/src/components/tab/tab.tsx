// SPDX-FileCopyrightText: 2024 caixw
//
// SPDX-License-Identifier: MIT


import { createSignal, For, JSX } from 'solid-js';

import { BaseProps } from '@/components/base';
import { Button } from '@/components/button';

type Key = string | number;

export interface Props extends BaseProps {
    rounded?: boolean;

    disabled?: boolean;

    class?: string;

    items: Array<[key: Key, title: JSX.Element]>

    /**
     * 默认选中的值，如果为空，则选中第一个项。
     */
    value?: Key;

    /**
     * 非响应属性
     */
    onChange?: { (val: Key, old?: Key): void };
}

export function Tab(props: Props) {
    const [val, setVal] = createSignal<Key>(props.value ?? props.items[0][0]);

    const change = (val: Key, old?: Key): void => {
        if (props.onChange) {
            props.onChange(val, old);
        }
        setVal(val);
    };

    return <fieldset role="group" class={props.class} disabled={props.disabled} classList={{
        'c--tab': true,
        'c--tab-rounded': props.rounded,
        [`palette--${props.palette}`]: !!props.palette
    }}>
        <For each={props.items}>
            {(item)=>(
                <Button class="rounded-none" checked={val() == item[0]}
                    onClick={() => { change(item[0], props.value); }}
                >{item[1]}</Button>
            )}
        </For>
    </fieldset>;
}