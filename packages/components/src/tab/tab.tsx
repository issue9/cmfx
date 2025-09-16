// SPDX-FileCopyrightText: 2024-2025 caixw
//
// SPDX-License-Identifier: MIT

import {
    createEffect, createMemo, createSignal, For, JSX, mergeProps, onCleanup, onMount, ParentProps, Show
} from 'solid-js';
import IconPrev from '~icons/material-symbols/chevron-left';
import IconNext from '~icons/material-symbols/chevron-right';

import { BaseProps, joinClass, Layout } from '@/base';
import { ChangeFunc } from '@/form/field';
import styles from './style.module.css';

export interface Item {
    /**
     * 该 Tab 的唯一 ID
     */
    id: string;

    /**
     * Tab 标签上的内容
     */
    label?: JSX.Element;

    /**
     * 该标签处于禁用状态
     */
    disabled?: boolean;
}

export interface Props extends BaseProps, ParentProps {
    /**
     * 所有的 tab 项
     *
     * @reactive
     */
    items: Array<Item>;

    /**
     * 布局
     *
     * @defaultValue 'horizontal'
     */
    layout?: Layout;

    /**
     * 默认选中的值，如果为空，则选中第一个项。
     *
     * @reactive
     */
    value?: Item['id'];

    /**
     * 应用在标签面板上的样式
     */
    panelClass?: string;

    onChange?: ChangeFunc<Item['id']>;
}

/**
 * Tab 组件
 */
export function Tab(props: Props) {
    props = mergeProps({ layout: 'horizontal' as Layout }, props);
    const layout = props.layout!;

    const [val, setVal] = createSignal<Item['id']>(props.value ?? props.items[0].id);

    const change = (v: Item['id'], old?: Item['id']): void => {
        if (props.onChange) { props.onChange(v, old); }
        setVal(() => v);
    };

    // 监视 props.value 的变化
    createEffect(() => {
        setVal(() => props.value ?? props.items[0].id);
    });

    const [isOverflow, setIsOverflow] = createSignal(false);
    const [tabsRef, setTabsRef] = createSignal<HTMLDivElement>();

    onMount(() => {
        const observer = new ResizeObserver(() => {
            const ref = tabsRef();
            if (!ref) { return; }

            setIsOverflow(layout === 'horizontal'
                ? Array.from(ref.children).reduce((acc, curr) => acc + curr.scrollWidth, 0) > ref.clientWidth
                : Array.from(ref.children).reduce((acc, curr) => acc + curr.scrollHeight, 0) > ref.clientHeight);
        });
        observer.observe(tabsRef()!);

        onCleanup(() => { observer.disconnect(); });
    });


    // 组件根元素的 css
    const cls = createMemo(() => {
        return joinClass(styles.tab,
            props.palette ? `palette--${props.palette}` : '',
            layout === 'vertical' ? styles.vertical : styles.horizontal,
            props.class);
    });

    let scrollerRef: HTMLDivElement | undefined;

    // 鼠标滚轮事件
    const wheel = (e: WheelEvent) => {
        if (!scrollerRef) { return; }

        e.preventDefault();
        if (e.deltaY === 0) { return; }

        if (layout === 'horizontal') {
            scrollerRef.scrollBy({ left: e.deltaY, behavior: 'smooth' });
        }else{
            scrollerRef.scrollBy({ top: e.deltaY, behavior: 'smooth' });
        }
    };

    // 两侧按钮的事件，delta 表示滚动去方向，负数向前，正数向后。
    const scroll = (e: MouseEvent, delta: number) => {
        if (!scrollerRef) { return; }

        e.preventDefault();

        if (layout === 'horizontal') {
            scrollerRef.scrollBy({ left: delta, behavior: 'smooth' });
        } else {
            scrollerRef.scrollBy({ top: delta, behavior: 'smooth' });
        }
    };

    return <div role="tablist" aria-orientation={layout} class={cls()}>
        <div ref={setTabsRef} class={joinClass(styles.tabs, props.children ? styles['has-panel'] : '')}>
            <Show when={isOverflow()}>
                <button class={styles.prev} onclick={e => scroll(e, -40)}>
                    <IconPrev class={layout === 'vertical' ? 'rotate-90' : ''} />
                </button>
                <div class={styles.scroller} onwheel={wheel} ref={el => scrollerRef = el}>
                    <For each={props.items}>
                        {item => (
                            <button role='tab' aria-selected={val() == item.id} disabled={item.disabled}
                                class={joinClass(styles.item, val() === item.id ? styles.select : '')}
                                onClick={() => { change(item.id, props.value); }}
                            >
                                {item.label}
                            </button>
                        )}
                    </For>
                </div>
                <button class={styles.next} onclick={e => scroll(e, 40)}>
                    <IconNext class={layout === 'vertical' ? 'rotate-90' : ''} />
                </button>
            </Show>
            <Show when={!isOverflow()}>
                <For each={props.items}>
                    {item => (
                        <button role='tab' aria-selected={val() == item.id} disabled={item.disabled}
                            class={joinClass(styles.item, val() === item.id ? styles.select : '')}
                            onClick={() => { change(item.id, props.value); }}
                        >
                            {item.label}
                        </button>
                    )}
                </For>
            </Show>
        </div>

        <Show when={props.children}>
            <div role="tabpanel" class={props.panelClass}>{props.children}</div>
        </Show>
    </div>;
}
