// SPDX-FileCopyrightText: 2025 caixw
//
// SPDX-License-Identifier: MIT

import { calcPopoverPosition, Hotkey, sleep } from '@cmfx/core';
import { A, useMatch } from '@solidjs/router';
import {
    createEffect, createMemo, createSignal, For, JSX, Match, mergeProps, onCleanup, onMount, Show, Switch
} from 'solid-js';
import { Dynamic } from 'solid-js/web';
import IconArrowDown from '~icons/material-symbols/keyboard-arrow-down';
import IconArrowRight from '~icons/material-symbols/keyboard-arrow-right';
import IconArrowUp from '~icons/material-symbols/keyboard-arrow-up';

import { AvailableEnumType, BaseProps, classList, joinClass, Layout, RefProps } from '@/base';
import { useTheme } from '@/context';
import { Divider } from '@/divider';
import { ChangeFunc } from '@/form/field';
import { IconSet, IconSetRef } from '@/icon';
import { buildRenderItemType, MenuItem, RenderMenuItem } from './item';
import styles from './style.module.css';

export interface Ref {
    /**
     * 返回组件的根元素
     */
    root(): HTMLMenuElement | HTMLElement;

    /**
     * 将选中项滚动到可见范围
     *
     * @remarks 如果选中项是子菜单，那么将滚动到让其父元素处于可见位置。
     */
    scrollSelectedIntoView(): void;
}

type CF<M extends boolean = false, T extends AvailableEnumType = string, V = M extends true ? T[] : T>
    = ChangeFunc<V>;

export interface Props<M extends boolean = false, T extends AvailableEnumType = string> extends BaseProps, RefProps<Ref> {
    /**
     * 组件布局方式，可以有以下取值：
     *
     *  - horizontal 横向菜单，子菜单以弹出形式展示；
     *  - vertical 纵向菜单，子菜单以弹出形式展示；
     *  - inline 内联菜单，纵向菜单的变体，子菜单内嵌在组件之内；
     */
    layout?: Layout | 'inline';

    /**
     * 多选模式
     *
     * @remarks
     * 在该模式下，点击并不会主动关闭弹出的菜单。如果子项的 type 为 a，那么多选对该项无效。
     */
    multiple?: M;

    /**
     * 菜单项
     *
     * @reactive
     */
    items: Array<MenuItem<T>>;

    /**
     * 当选择项发生变化时触发的事件
     */
    onChange?: CF<M, T>;

    /**
     * 默认的选中项
     *
     * @reactive
     */
    value?: Array<T>;

    /**
     * 根元素的标签类型
     *
     * @defaultValue 'nav'
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
}

/**
 * 菜单组件
 *
 * @typeParam M - 是否多选；
 * @typeParam T - 选项类型；
 */
export default function Menu<M extends boolean = false, T extends AvailableEnumType = string>(
    props: Props<M, T>
): JSX.Element {
    props = mergeProps({
        tag: 'nav' as Props['tag'],
        selectedClass: styles.selected,
        disabledClass: styles.disabled,
        layout: 'inline' as Layout,
    }, props);

    const layout = props.layout;
    const isMultiple = props.multiple ?? false;;
    const [selected, setSelected] = createSignal<Array<T>>(props.value ?? []);
    createEffect(() => { setSelected(props.value ?? []); }); // 监视外部变化
    let ref: HTMLElement;
    const t = useTheme();

    const handleKeydown = (event: KeyboardEvent) => {
        const active = document.activeElement as HTMLElement | null;
        if (!ref || !active || !ref.contains(active)) { return; }

        if (event.key === 'Enter') { // 处理回车
            if (layout === 'inline') {
                active.click();
            } else {
                // 模拟 hover 操作
                const enterEvent = new MouseEvent('mouseenter', { bubbles: true, cancelable: true });
                active.dispatchEvent(enterEvent);

                active.click();

                // 没有子菜单，则要取消 Hover 操作
                if (!active.parentElement?.querySelector(':scope>ul')) {
                    const leaveEvent = new MouseEvent('mouseleave', { bubbles: true, cancelable: true });
                    active.dispatchEvent(leaveEvent);
                }
            }
        }
    };
    onMount(() => { document.addEventListener('keydown', handleKeydown); });
    onCleanup(() => { document.removeEventListener('keydown', handleKeydown); });

    /**
     * 生成菜单项以及其子项的内容
     */
    const buildMenuItem = (item: RenderMenuItem<T>, dividerLayout: Layout = 'horizontal'): JSX.Element => {
        return <Switch>
            <Match when={item.type === 'divider'}>
                <li class={styles.divider}><Divider padding='0' layout={dividerLayout} /></li>
            </Match>

            <Match when={item.type === 'group' ? item : undefined}>
                {i =>
                    <>
                        <li class={styles.group}><p class={styles.title}>{i().label}</p></li>
                        <For each={i().items}>{child => buildMenuItem(child)}</For>
                    </>
                }
            </Match>

            <Match when={(item.type === 'item' || item.type === 'a') ? item : undefined}>
                {i => {
                    const hk = i().hotkey;
                    let liRef: HTMLLIElement | undefined;
                    if (hk) {
                        onMount(() => { Hotkey.bind(hk, () => { liRef!.click(); }); });
                        onCleanup(() => { Hotkey.unbind(hk); });
                    }

                    const val = i().value;

                    let iconRef: IconSetRef;
                    const [expanded, setExpanded] = createSignal(false);
                    const hasItems = i().items && i().items!.length > 0;
                    const isAnchor = item.type === 'a';

                    const isSelected = createMemo(() => {
                        if (!val) { return false; }

                        // AvailableEnumType 只能是 string 和 number，用 toString 没问题
                        const vs = val.toString();
                        return (!isAnchor && selected().includes(val))
                            || (isAnchor && !!useMatch(() => vs[vs.length - 1] === '/' ? vs : `${vs}/*?`)());
                    });
                    const cls = createMemo(() => joinClass(
                        undefined,
                        styles.item,
                        i().disabled ? props.disabledClass : '',
                        isSelected() ? props.selectedClass : '',
                    ));

                    return <li ref={el => liRef = el} aria-selected={isSelected()} class={cls()} onMouseEnter={e => {
                        if (layout === 'inline') { return; }

                        const curr = e.currentTarget as HTMLLIElement;
                        const ul = curr.querySelector(':scope>ul') as HTMLUListElement;
                        if (!ul) { return; }

                        ul.classList.remove('pop');
                        ul.classList.add('popopen');
                        const rtl = window.getComputedStyle(ul).direction === 'rtl';
                        const p = i().level === 0
                            ? calcPopoverPosition(ul, curr.getBoundingClientRect(),
                                layout === 'vertical' ? 'right' : 'bottom', 'start', 0, rtl)
                            : calcPopoverPosition(ul, curr.getBoundingClientRect(), 'right', 'start', 0, rtl);

                        ul.style.top = p.y + 'px';
                        ul.style.bottom = 'unset';
                        ul.style.left = p.x + 'px';
                        ul.style.right = 'unset';
                        e.preventDefault();
                    }} onMouseLeave={e => {
                        if (layout === 'inline') { return; }

                        const curr = e.currentTarget as HTMLLIElement;
                        const ul = curr.querySelector(':scope>ul') as HTMLUListElement;
                        if (!ul) { return; }

                        ul.classList.remove('popopen');
                        ul.classList.add('pop');
                        e.preventDefault();
                    }} onClick={async e => {
                        if (i().disabled) { return; }
                        e.stopPropagation();

                        if (!hasItems) {
                            if (isMultiple) { // 多选
                                const old = selected();
                                setSelected(prev => {
                                    if (prev.includes(val!)) {
                                        return prev.filter(item => item !== val);
                                    } else {
                                        return [...prev, val!];
                                    }
                                });
                                if (props.onChange) {
                                    (props.onChange as CF<true, T>)(selected(), old);
                                }
                            } else { // 单选
                                const old = selected();
                                setSelected([val!]);
                                if (props.onChange) {
                                    (props.onChange as CF<false, T>)(val!, old[0]);
                                }

                                if (layout !== 'inline') { // 单选，还得处理弹出内容关闭的问题
                                    if (i().level > 0) {
                                        let ul = e.currentTarget.parentElement!;
                                        for (let lv = 1; lv < i().level;lv++) {
                                            ul = ul.parentElement!.parentElement!;
                                        }
                                        ul.classList.remove('popopen');
                                        ul.classList.add('pop');
                                    }
                                }
                            }
                        } else if (layout === 'inline') { // 点击带有子菜单且为 inline
                            setExpanded(!expanded());
                            iconRef.to(expanded() ? 'up' : 'down');

                            const curr = e.currentTarget as HTMLLIElement;
                            let ul = curr.querySelector(':scope>ul') as HTMLUListElement;
                            if (!ul) { return; }

                            if (!expanded()) { // 收起
                                const h = ul.scrollHeight;
                                ul.style.height = '0'; // 触发动画

                                while (true) { // 为外层元素减少当前元素的高度
                                    ul = ul.parentElement!.parentElement! as HTMLUListElement;
                                    if (!ul) { break; }

                                    ul.style.height = (ul.scrollHeight - h) + 'px';

                                    if (ul.dataset.menuRoot) { break; }
                                }
                            } else { // 展开
                                const h = ul.scrollHeight;
                                ul.style.height = h + 'px'; // 触发动画到内容高度

                                while (true) { // 为外层元素增加当前元素的高度
                                    ul = ul.parentElement!.parentElement! as HTMLUListElement;
                                    if (!ul) { break; }

                                    ul.style.height = (ul.scrollHeight + h) + 'px';

                                    if (ul.dataset.menuRoot) { break; }
                                };
                            }
                        }
                    }}>
                        <Dynamic class={styles.title} tabindex={0} component={(isAnchor && !hasItems) ? A : 'p'}
                            href={(isAnchor && !i().disabled) ? (val?.toString() ?? '') : ''}
                            style={{
                                'padding-inline-start': layout === 'inline'
                                    ? `calc(var(--spacing) * (${i().level} * 4 + 3))` : undefined,
                            }}
                        >
                            <Show when={i().prefix}>
                                {prefix => <div class={styles.icon}>{prefix()}</div>}
                            </Show>
                            {i().label}
                            <Show when={i().suffix}>
                                {suffix => <span class={styles.suffix}>{suffix()}</span>}
                            </Show>
                            <Show when={hasItems}>
                                <Switch fallback={<IconArrowRight class={joinClass(undefined, styles.icon, styles.suffix, styles['more-arrow'])} />}>
                                    <Match when={layout === 'horizontal'}>
                                        <Switch>
                                            <Match when={i().level === 0}>
                                                {<IconArrowDown class={joinClass(undefined, styles.icon, styles.suffix)} />}
                                            </Match>
                                            <Match when={i().level > 0}>
                                                {<IconArrowRight class={joinClass(undefined, styles.icon, styles.suffix, styles['more-arrow'])} />}
                                            </Match>
                                        </Switch>
                                    </Match>
                                    <Match when={layout === 'inline'}>
                                        <IconSet ref={el => iconRef = el} rotation='none'
                                            class={joinClass(undefined, styles.icon, styles.suffix)} palette={props.palette}
                                            icons={{ up: <IconArrowUp />, down: <IconArrowDown /> }}
                                        />
                                    </Match>
                                </Switch>
                            </Show>
                        </Dynamic>
                        <Show when={i().items}>
                            {items =>
                                <ul>
                                    <For each={items()}>{child => buildMenuItem(child)}</For>
                                </ul>
                            }
                        </Show>
                    </li>;
                }}
            </Match>
        </Switch>;
    };

    return <Dynamic data-menu-root component={props.tag} ref={(el: HTMLMenuElement | HTMLElement) => {
        ref = el;
        if (props.ref) {
            props.ref({
                root: () => el,
                scrollSelectedIntoView: () => {
                    sleep(t.scheme.transitionDuration).then(() => {
                        const els = selectedElements(el, true);
                        if (els.length > 0) {
                            els[0].scrollIntoView({ behavior: 'smooth', block: 'nearest' });
                        }
                    });
                },
            }); }
    }}
    class={classList(props.palette, {
        [styles.horizontal]: layout === 'horizontal',
        [styles.vertical]: layout === 'vertical',
        [styles.inline]: layout === 'inline',
    }, styles.menu, props.class)}
    style={props.style}
    >
        <For each={buildRenderItemType(props.items, 0)}>
            {item => buildMenuItem(item, layout === 'horizontal' ? 'vertical' : 'horizontal')}
        </For>
    </Dynamic>;
}

export function selectedElements(menu: HTMLElement, root?: boolean) {
    if (root) {
        return menu.querySelectorAll(':scope>li[aria-selected="true"],:scope>li:has(li[aria-selected="true"])');
    }
    return menu.querySelectorAll(':scope li[aria-selected="true"]');
}
