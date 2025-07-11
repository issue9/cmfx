// SPDX-FileCopyrightText: 2024-2025 caixw
//
// SPDX-License-Identifier: MIT

import { createSignal, For, JSX } from 'solid-js';

import { BaseProps, Layout } from '@/base';
import { Button, ButtonGroup } from '@/button';

export interface Props<T extends string | number> extends BaseProps {
    rounded?: boolean;

    disabled?: boolean;

    class?: string;

    items: Array<[key: T, title: JSX.Element]>

    layout?: Layout;

    /**
     * 默认选中的值，如果为空，则选中第一个项。
     */
    value?: T;

    /**
     * 非响应属性
     */
    onChange?: { (val: T, old?: T): void };
}

export function Tab<T extends string | number>(props: Props<T>) {
    if (!props.layout) { props.layout = 'horizontal'; }

    const [val, setVal] = createSignal<T>(props.value ?? props.items[0][0]);

    const change = (v: T, old?: T): void => {
        if (props.onChange) {
            props.onChange(v, old);
        }
        setVal(() => v);
    };

    return <ButtonGroup rounded={props.rounded} class={props.class} layout={props.layout} disabled={props.disabled}>
        <For each={props.items}>
            {item => (
                <Button checked={val() == item[0]} onClick={() => { change(item[0], props.value); }}>{item[1]}</Button>
            )}
        </For>
    </ButtonGroup>;
}
