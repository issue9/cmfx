// SPDX-FileCopyrightText: 2024-2025 caixw
//
// SPDX-License-Identifier: MIT

import { Hotkey } from '@cmfx/core';
import { A } from '@solidjs/router';
import { createSignal, For, JSX, Match, mergeProps, onCleanup, onMount, Switch } from 'solid-js';
import { Dynamic } from 'solid-js/web';
import IconChevronRight from '~icons/material-symbols/chevron-right';

import { AvailableEnumType, joinClass } from '@/base';
import { Divider } from '@/divider';
import type { Props as ContainerProps } from '@/tree/container';
import { Item } from '@/tree/item';
import styles from './style.module.css';

export type Ref = HTMLMenuElement;

export interface Props extends ContainerProps {
    /**
     * 当选择项发生变化时触发的事件
     */
    onChange?: { (selected?: AvailableEnumType, old?: AvailableEnumType): void };

    /**
     * 是否采用 {@link A} 标签
     *
     * 如果为 true，那为 {@link Item#value} 将作为链接的值。
     */
    anchor?: boolean;

    ref?: { (el: Ref): void; };

    popover?: boolean | 'auto' | 'manual';

    /**
     * 菜单展开的方向
     */
    direction?: 'left' | 'right';
}

export const presetProps: Readonly<Partial<Props>> = {
    selectedClass: styles.selected,
    direction: 'right'
} as const;

export default function Panel (props: Props): JSX.Element {
    props = mergeProps(presetProps, props);
    const [selected, setSelected] = createSignal<AvailableEnumType>();

    const All = (p: { items: Array<Item> }): JSX.Element => {
        return <For each={p.items}>
            {(item) => (
                <Switch>
                    <Match when={item.type === 'divider'}>
                        <Divider />
                    </Match>
                    <Match when={item.type === 'group'}>
                        <p class={styles.group}>{(item as any).label}</p>
                        <All items={(item as any).items} />
                    </Match>
                    <Match when={item.type === 'item'}>
                        <Items item={item} />
                    </Match>
                </Switch>
            )}
        </For>;
    };

    // 渲染 type==item 的元素
    const Items = (p: { item: Item }) => {
        if (p.item.type !== 'item') {
            throw 'item.type 只能是 item';
        }

        let ref: HTMLElement;

        if (p.item.hotkey) {
            const hk = p.item.hotkey;
            onMount(() => { Hotkey.bind(hk, () => { ref.click(); }); });
            onCleanup(() => { Hotkey.unbind(hk); });
        }

        return <Switch>
            <Match when={p.item.items && p.item.items.length > 0}>
                <li class={styles.item}>
                    {p.item.label}
                    <IconChevronRight class={styles.expand} />
                    <menu class={joinClass(styles.menu, styles[props.direction!])}>
                        <All items={p.item.items as Array<Item>} />
                    </menu>
                </li>
            </Match>
            <Match when={!p.item.items}>
                <Dynamic component={props.anchor ? A : 'span'} ref={(el:HTMLElement)=>ref=el}
                    activeClass={props.selectedClass}
                    href={props.anchor ? (p.item.value?.toString() ?? '') : ''}
                    classList={{
                        [styles.item]: true,
                        // anchor 的类型定义在 activeClass 属性
                        [props.anchor ? '' : props.selectedClass!]: !!props.selectedClass && selected() === p.item.value,
                    }}
                    onClick={(e: MouseEvent) => {
                        if (p.item.type !== 'item') { throw 'p.item.type 必须为 item'; }

                        const old = selected();

                        if (props.onChange) {
                            props.onChange(p.item.value, old);
                        }

                        setSelected(p.item.value);

                        if (!props.anchor) {
                            e.preventDefault();
                            e.stopPropagation();
                        }
                    }}>{p.item.label}</Dynamic>
            </Match>
        </Switch>;
    };

    return <menu popover={props.popover} role="menu" ref={(el: Ref) => { if (props.ref) { props.ref(el); }}}
        class={joinClass(styles.menu, props.palette ? `palette--${props.palette}` : undefined)}>
        <All items={props.children} />
    </menu>;
}
