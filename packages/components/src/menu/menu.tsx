// SPDX-FileCopyrightText: 2025 caixw
//
// SPDX-License-Identifier: MIT

import { createMemo, createSignal, For, JSX, Match, mergeProps, Show, Switch } from 'solid-js';
import { Dynamic } from 'solid-js/web';
import IconArrowDown from '~icons/material-symbols/keyboard-arrow-down';

import { AvailableEnumType, BaseProps, classList, joinClass, Layout } from '@/base';
import { Divider } from '@/divider';
import { buildRenderItemType, MenuItem } from './item';
import styles from './style.module.css';

export type Ref = HTMLMenuElement;

export interface Props extends BaseProps {
    /**
     * 组件布局方式，可以有以下取值：
     *  - horizontal 横向菜单，子菜单以弹出形式展示；
     *  - vertical 纵向菜单，子菜单以弹出形式展示；
     *  - inline 内联菜单，纵向菜单的变体，子菜单内嵌在组件之内；
     */
    layout?: Layout | 'inline';

    collapsed?: boolean;

    /**
     * 多选模式，在该模式下，点击并不会主动关闭弹出的菜单。
     *
     * 不能与  {@link Props#anchor} 同时使用。
     */
    multiple?: boolean;

    /**
     * 是否采用 {@link A} 标签
     *
     * 如果为 true，那为 {@link MenuItem#value} 将作为链接的值。
     */
    anchor?: boolean;

    /**
     * 菜单项
     */
    children: Array<MenuItem>;

    /**
     * 当选择项发生变化时触发的事件
     */
    onChange?: { (selected?: AvailableEnumType, old?: AvailableEnumType): void };

    ref?: { (el: Ref): void; };

    popover?: boolean | 'auto' | 'manual';

    /**
     * 根元素的标签类型
     */
    tag?: 'nav' | 'menu';

    selectedClass?: string;
    disabledClass?: string;
    class?: string;
}

export const presetProps: Readonly<Partial<Props>> = {
    tag: 'nav',
    selectedClass: styles.selected,
    disabledClass: styles.disabled,
    layout: 'inline',
} as const;

export default function Menu(props: Props): JSX.Element {
    props = mergeProps(presetProps, props);
    const [selected, setSelected] = createSignal<AvailableEnumType>();

    const items = createMemo(() => {
        const ret = buildRenderItemType(props.children, 0, props.selectedClass!, props.disabledClass!, selected());
        return ret[0];
    });

    const buildMenuItem = (item: MenuItem, dividerLayout: Layout = 'horizontal'): JSX.Element => {
        return <Switch>
            <Match when={item.type === 'divider'}>
                <li class={styles.divider}><Divider padding='0' layout={dividerLayout} /></li>
            </Match>

            <Match when={item.type === 'group' ? item : undefined}>
                {i =>
                    <>
                        <li class={styles.group}>
                            <p>{i().label}</p>
                        </li>
                        <For each={i().items}>
                            {child => buildMenuItem(child)}
                        </For>
                    </>
                }
            </Match>

            <Match when={item.type === 'item' ? item : undefined}>
                {i => {
                    const [expanded, setExpanded] = createSignal(false);

                    return <li class={styles.item} onClick={e => {
                        if (props.layout !== 'inline') { return; }
                        setExpanded(!expanded());
                        e.preventDefault();
                        e.stopPropagation();
                    }}>
                        <p>
                            <Show when={i().icon} fallback={<span class={joinClass(styles.icon, styles.none)} />}>
                                {icon => { return icon()({ class: styles.icon }); }}
                            </Show>
                            {i().label}
                            <Show when={i().suffix}>{i().suffix}</Show>
                            <Show when={i().items}>
                                <IconArrowDown class={joinClass(styles.icon, styles.suffix)} />
                            </Show>
                        </p>
                        <Show when={i().items}>
                            {items =>
                                <ul classList={{
                                    'hidden': !expanded() && props.layout === 'inline',
                                    'flex': expanded() && props.layout === 'inline',
                                }}>
                                    <For each={items()}>
                                        {child => buildMenuItem(child)}
                                    </For>
                                </ul>
                            }
                        </Show>
                    </li>;
                }}
            </Match>
        </Switch>;
    };

    const dividerLayout = props.layout === 'horizontal' ? 'vertical' : 'horizontal';
    return <Dynamic component={props.tag}
        class={classList({
            [styles.horizontal]: props.layout === 'horizontal',
            [styles.vertical]: props.layout === 'vertical',
            [styles.inline]: props.layout === 'inline',
            [`palette--${props.palette}`]: !!props.palette,
        }, styles.menu, props.class)}
    >
        <For each={items()}>{item => buildMenuItem(item, dividerLayout)}</For>
    </Dynamic>;
}
