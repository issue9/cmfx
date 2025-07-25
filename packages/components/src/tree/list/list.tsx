// SPDX-FileCopyrightText: 2024-2025 caixw
//
// SPDX-License-Identifier: MIT

import { Hotkey, sleep } from '@cmfx/core';
import { A, useLocation } from '@solidjs/router';
import {
    createEffect, createSignal, For, JSX, Match, mergeProps, onCleanup, onMount, Show, Switch, untrack
} from 'solid-js';
import { Dynamic } from 'solid-js/web';
import IconArrowDown from '~icons/material-symbols/keyboard-arrow-down';
import IconArrowUp from '~icons/material-symbols/keyboard-arrow-up';

import { AvailableEnumType, classList, joinClass, transitionDuration } from '@/base';
import { Divider } from '@/divider';
import type { Props as ContainerProps } from '@/tree/container';
import { findItems, type Item } from '@/tree/item';
import styles from './style.module.css';

export interface Props extends ContainerProps {
    /**
     * 设置选中项
     */
    selected?: AvailableEnumType;

    /**
     * 当选择项发生变化时触发的事件
     */
    onChange?: { (selected: AvailableEnumType, old?: AvailableEnumType): void };

    /**
     * 可点击的元素是否以 {@link A} 作为标签名
     *
     * 如果为 true，那为 {@link Item#value} 将作为链接的值。
     *
     * NOTE: 如果此值为 true，且 {@link Props#selected} 为 undefined，
     * 则会尝试从地址中获取相应的值。
     *
     * NOTE: 该值为非响应属性。
     */
    anchor?: boolean;
}

const presetProps: Readonly<Partial<Props>> = {
    selectedClass: styles.selected
};

/**
 * 列表组件
 */
export function List(props: Props): JSX.Element {
    props = mergeProps(presetProps, props);

    let oldValue: AvailableEnumType | undefined;
    const [selected, setSelected] = createSignal<AvailableEnumType | undefined>(
        props.selected ?? (props.anchor ? useLocation().pathname : undefined));
    const [selectedIndexes, setSelectedIndexes] = createSignal(findItems(props.children, selected())); // 选中项在每一层中的索引
    const [ref, setRef] = createSignal<HTMLElement>(); // 记录最终选中项

    createEffect(() => {
        oldValue = untrack(selected);
        setSelected(props.selected);
        setSelectedIndexes(findItems(props.children, props.selected));
    });

    createEffect(() => {
        if (ref()) {
            sleep(transitionDuration(300)).then(() => { // 等待动画完成，再滚动。否则先滚动到指定位置，再展开，将显示错位。
                ref()!.scrollIntoView({ block: 'center', behavior: 'smooth' });
            });
        }
    });

    const All = (p: { items: Array<Item>, indent: number, selectedIndex: number }): JSX.Element => {
        return <For each={p.items}>
            {(item, index) => {
                const [isSelected, setIsSelected] = createSignal(false);
                const [selectedIndex, setSelectedIndex] = createSignal(-100);

                createEffect(() => {
                    setIsSelected(!!selectedIndexes()
                        && (p.selectedIndex >= 0)
                        && (index() >= 0)
                        && (index() === selectedIndexes()![p.selectedIndex]));
                    setSelectedIndex(untrack(isSelected) ? p.selectedIndex + 1 : -100);
                });

                return <Switch>
                    <Match when={item.type === 'divider'}>
                        <Divider />
                    </Match>
                    <Match when={item.type === 'group'}>
                        <p class="group">{(item as any).label}</p>
                        <All items={(item as any).items} indent={p.indent} selectedIndex={selectedIndex()} />
                    </Match>
                    <Match when={item.type === 'item'}>
                        <Items item={item} indent={p.indent} selectedIndex={selectedIndex()}
                            isSelected={isSelected()} />
                    </Match>
                </Switch>;
            }}
        </For>;
    };

    // 渲染 type==item 的元素
    // isSelected 当前项是否是选中项或是选中项的父级元素。
    const Items = (p: { item: Item, indent: number, selectedIndex: number, isSelected: boolean }) => {
        if (p.item.type !== 'item') {
            throw 'item.type 只能是 item';
        }

        let ref: HTMLElement;

        const [open, setOpen] = createSignal(p.isSelected);
        createEffect(() => {
            setOpen(p.isSelected);

            if (p.isSelected && ref) {
                setRef(ref);
            }
        });

        if (p.item.hotkey) {
            const hk = p.item.hotkey;
            onMount(() => { Hotkey.bind(hk, () => { ref.click(); }); });
            onCleanup(() => { Hotkey.unbind(hk); });
        }

        return <Switch>
            <Match when={p.item.items && p.item.items.length > 0}>
                <div class={styles.details}>
                    <div class={joinClass(styles.summary, styles.item)} onclick={() => setOpen(!open())}
                        style={{ 'padding-left': `calc(${p.indent} * var(--item-space))` }}
                    >
                        {p.item.label}
                        <Show when={open()} fallback={<IconArrowDown class={styles.expand} />}>
                            <IconArrowUp class={styles.expand} />
                        </Show>
                    </div>
                    <Show when={p.item.items}>
                        <menu classList={{ [styles['hidden-menu']]: !open() }}>
                            <div class={styles.menus}>
                                <All items={p.item.items!} indent={p.indent + 1} selectedIndex={p.selectedIndex} />
                            </div>
                        </menu>
                    </Show>
                </div>
            </Match>
            <Match when={!p.item.items}>
                <Dynamic ref={(el: HTMLElement)=>ref=el} component={props.anchor ? A : 'span'}
                    activeClass={props.anchor ? props.selectedClass : undefined}
                    href={props.anchor ? (p.item.value?.toString() ?? '') : ''}
                    style={{ 'padding-left': `calc(${p.indent} * var(--item-space))` }}
                    class={classList({
                        // anchor 的类型定义在 activeClass 属性
                        [props.anchor ? '' : props.selectedClass!]: !!props.selectedClass && selected() === p.item.value,
                    }, styles.item)}
                    onClick={(e: MouseEvent) => {
                        if (p.item.type !== 'item') { throw 'p.item.type 必须为 item'; }

                        if (props.onChange && p.item.value) {
                            oldValue = selected(); // 只有 onchange 时，oldValue 才会被赋值。
                            props.onChange(p.item.value, oldValue);
                        }

                        setSelected(p.item.value);

                        if (!props.anchor) {
                            e.preventDefault();
                        }
                    }}>{p.item.label}</Dynamic>
            </Match>
        </Switch>;
    };

    return <menu role="menu" class={joinClass(styles.list, props.palette ? `palette--${props.palette}` : undefined)}>
        <All items={props.children} indent={1} selectedIndex={0} />
    </menu>;
}
