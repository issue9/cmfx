// SPDX-FileCopyrightText: 2025 caixw
//
// SPDX-License-Identifier: MIT

import { sleep } from '@cmfx/core';
import { createEffect, createMemo, createSignal, For, JSX, Match, mergeProps, Show, Switch } from 'solid-js';
import { Dynamic } from 'solid-js/web';
import IconArrowDown from '~icons/material-symbols/keyboard-arrow-down';
import IconArrowRight from '~icons/material-symbols/keyboard-arrow-right';
import IconArrowUp from '~icons/material-symbols/keyboard-arrow-up';

import { AvailableEnumType, BaseProps, classList, joinClass, Layout } from '@/base';
import { Divider } from '@/divider';
import { AnimationIconRef } from '@/icon';
import { AnimationIcon } from '@/icon/animation';
import { buildRenderItemType, RenderMenuItem } from './item';
import styles from './style.module.css';

export type Ref = HTMLElement;

interface ChangeFunc<M extends boolean = false, V = M extends true ? AvailableEnumType[] : AvailableEnumType> {
    (selected?: V, old?: V): void;
}

export interface Props<M extends boolean = false> extends BaseProps {
    /**
     * 组件布局方式，可以有以下取值：
     *  - horizontal 横向菜单，子菜单以弹出形式展示；
     *  - vertical 纵向菜单，子菜单以弹出形式展示；
     *  - inline 内联菜单，纵向菜单的变体，子菜单内嵌在组件之内；
     */
    layout?: Layout | 'inline';

    /**
     * 多选模式，在该模式下，点击并不会主动关闭弹出的菜单。
     *
     * 不能与  {@link Props#anchor} 同时使用。
     */
    multiple?: M;

    /**
     * 是否采用 {@link A} 标签
     *
     * 如果为 true，那么 {@link RenderMenuItem#value} 将作为链接的值。
     */
    anchor?: M extends true ? false : boolean;

    /**
     * 菜单项
     */
    children: Array<RenderMenuItem>;

    /**
     * 当选择项发生变化时触发的事件
     */
    onChange?: ChangeFunc<M>;

    ref?: { (el: Ref): void; };

    /**
     * 初始的选中项
     */
    value?: Array<AvailableEnumType>;

    /**
     * 根元素的标签类型
     *
     * NOTE: 非响应式属性
     */
    tag?: 'nav' | 'menu';

    /**
     * 选中项的样式
     */
    selectedClass?: string;

    /**
     * 禁用项的样式
     */
    disabledClass?: string;

    /**
     * 根元素的样式
     */
    class?: string;
}

/**
 * 菜单组件
 */
export default function Menu<M extends boolean = false>(props: Props<M>): JSX.Element {
    props = mergeProps({
        tag: 'nav' as Props['tag'],
        selectedClass: styles.selected,
        disabledClass: styles.disabled,
        layout: 'inline' as Layout,
    }, props);

    const [selected, setSelected] = createSignal<Array<AvailableEnumType>>(props.value ?? []);
    let ref: HTMLElement;

    /**
     * 生成菜单项以及其子项的内容
     */
    const buildMenuItem = (item: RenderMenuItem, dividerLayout: Layout = 'horizontal'): JSX.Element => {
        return <Switch>
            <Match when={item.type === 'divider'}>
                <li class={styles.divider}><Divider padding='0' layout={dividerLayout} /></li>
            </Match>

            <Match when={item.type === 'group' ? item : undefined}>
                {i =>
                    <>
                        <li class={styles.group}><p>{i().label}</p></li>
                        <For each={i().items}>{child => buildMenuItem(child)}</For>
                    </>
                }
            </Match>

            <Match when={item.type === 'item' ? item : undefined}>
                {i => {
                    let iconRef: AnimationIconRef;
                    const [expanded, setExpanded] = createSignal(false);
                    const hasItems = i().items && i().items!.length > 0;
                    const cls = joinClass(styles.item, i().disabled ? props.disabledClass : undefined);

                    return <li class={cls} onClick={async e => {
                        if (i().disabled) { return; }

                        e.preventDefault();
                        e.stopPropagation();

                        if (!hasItems) {
                            const val = i().value;
                            if (props.multiple) { // 多选
                                const old = selected();
                                setSelected(prev => {
                                    if (prev.includes(val!)) {
                                        e.currentTarget.classList.remove(props.selectedClass!);
                                        return prev.filter(item => item !== val);
                                    } else {
                                        e.currentTarget.classList.add(props.selectedClass!);
                                        return [...prev, val!];
                                    }
                                });
                                if (props.onChange) {
                                    (props.onChange as ChangeFunc<true>)(selected(), old);
                                }
                            } else { // 单选
                                ref.querySelector(`.${props.selectedClass!}`)?.classList.remove(props.selectedClass!);
                                const old = selected();
                                setSelected([val!]);
                                if (props.onChange) {
                                    (props.onChange as ChangeFunc<false>)(selected()[0], old[0]);
                                }

                                e.currentTarget.classList.add(props.selectedClass!);
                                if (props.layout !== 'inline') { // 单选，还得处理弹出内容关闭的问题
                                    if (i().level > 0) {
                                        e.currentTarget.parentElement?.parentElement?.classList.add(styles.hide);
                                        await sleep(300);
                                        e.currentTarget.parentElement?.parentElement?.classList.remove(styles.hide);
                                    }
                                }
                            }
                        } else if (props.layout === 'inline') { // 点击带有子菜单的项
                            setExpanded(!expanded());
                            createEffect(() => {
                                iconRef.to(expanded() ? 'up' : 'down');
                            });
                        }
                    }}>
                        <p style={{
                            'padding-inline-start': props.layout === 'inline'
                                ? `calc(var(--spacing) * (${i().level} * 4 + 2))` : undefined,
                        }}>
                            <Show when={i().icon} fallback={<span class={joinClass(styles.icon, styles.none)} />}>
                                {icon => { return icon()({ class: styles.icon }); }}
                            </Show>
                            {i().label}
                            <Show when={i().suffix}>{i().suffix}</Show>
                            <Show when={hasItems}>
                                <Switch fallback={<IconArrowRight class={joinClass(styles.icon, styles.suffix)} />}>
                                    <Match when={props.layout === 'horizontal'}>
                                        <Switch>
                                            <Match when={i().level === 0}>
                                                <IconArrowDown class={joinClass(styles.icon, styles.suffix)} />
                                            </Match>
                                            <Match when={i().level > 0}>
                                                <IconArrowRight class={joinClass(styles.icon, styles.suffix)} />
                                            </Match>
                                        </Switch>
                                    </Match>
                                    <Match when={props.layout === 'inline'}>
                                        <AnimationIcon ref={el => iconRef = el} rotation='none'
                                            class={joinClass(styles.icon, styles.suffix)}
                                            icons={{ 'up': IconArrowUp, 'down': IconArrowDown }}
                                        />
                                    </Match>
                                </Switch>
                            </Show>
                        </p>
                        <Show when={i().items}>
                            {items =>
                                <ul classList={{
                                    '!hidden': !expanded() && props.layout === 'inline',
                                    '!flex': expanded() && props.layout === 'inline',
                                }}>
                                    <For each={items()}>{child => buildMenuItem(child)}</For>
                                </ul>
                            }
                        </Show>
                    </li>;
                }}
            </Match>
        </Switch>;
    };

    const renderRootItems = createMemo(() => {
        setSelected(props.value ?? []);
        return buildRenderItemType(props.children, 0);
    });

    const dividerLayout = props.layout === 'horizontal' ? 'vertical' : 'horizontal';
    return <Dynamic component={props.tag} ref={(el: HTMLElement) => ref = el}
        class={classList({
            [styles.horizontal]: props.layout === 'horizontal',
            [styles.vertical]: props.layout === 'vertical',
            [styles.inline]: props.layout === 'inline',
            [`palette--${props.palette}`]: !!props.palette,
        }, styles.menu, props.class)}
    >
        <For each={renderRootItems()}>{item => buildMenuItem(item, dividerLayout)}</For>
    </Dynamic>;
}
