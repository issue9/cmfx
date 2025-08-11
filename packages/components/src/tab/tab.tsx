// SPDX-FileCopyrightText: 2024-2025 caixw
//
// SPDX-License-Identifier: MIT

import { createEffect, createSignal, For, ParentProps } from 'solid-js';

import { AvailableEnumType, BaseProps, joinClass, Layout } from '@/base';
import { Button, ButtonGroup } from '@/button';
import { FieldOptions } from '@/form';
import { ChangeFunc } from '@/form/field';
import styles from './style.module.css';

export interface Props<T extends AvailableEnumType> extends BaseProps, ParentProps {
    rounded?: boolean;

    disabled?: boolean;

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

    // 监视 props.value 的变化
    createEffect(() => {
        setVal(() => props.value ?? props.items[0][0]);
    });

    return <div class={joinClass(styles.tab, props.class)} role="tablist" aria-orientation={props.layout}>
        <ButtonGroup rounded={props.rounded} disabled={props.disabled} layout={props.layout}>
            <For each={props.items}>
                {item => (
                    <Button role='tab' checked={val() == item[0]} aria-selected={val() == item[0]}
                        onClick={() => { change(item[0], props.value); }}
                    >
                        {item[1]}
                    </Button>
                )}
            </For>
        </ButtonGroup>
        <div role="tabpanel">{props.children}</div>
    </div>;
}
