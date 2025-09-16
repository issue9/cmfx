// SPDX-FileCopyrightText: 2024-2025 caixw
//
// SPDX-License-Identifier: MIT

import { createEffect, createMemo, createSignal, For, mergeProps, ParentProps, Show } from 'solid-js';
import IconPrev from '~icons/material-symbols/chevron-left';
import IconNext from '~icons/material-symbols/chevron-right';

import { AvailableEnumType, BaseProps, joinClass, Layout } from '@/base';
import { FieldOptions } from '@/form';
import { ChangeFunc } from '@/form/field';
import styles from './style.module.css';

export interface Props<T extends AvailableEnumType> extends BaseProps, ParentProps {
    /**
     * 所有的 tab 项
     *
     * @reactive
     */
    items: FieldOptions<T>;

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
    value?: T;

    onChange?: ChangeFunc<T>;
}

/**
 * Tab 组件
 */
export function Tab<T extends AvailableEnumType>(props: Props<T>) {
    props = mergeProps({ layout: 'horizontal' as Layout }, props);
    const layout = props.layout!;

    const [val, setVal] = createSignal<T>(props.value ?? props.items[0][0]);

    const change = (v: T, old?: T): void => {
        if (props.onChange) { props.onChange(v, old); }
        setVal(() => v);
    };

    // 监视 props.value 的变化
    createEffect(() => {
        setVal(() => props.value ?? props.items[0][0]);
    });

    const [isOverflow, setIsOverflow] = createSignal(false);
    const [tabsRef, setTabsRef] = createSignal<HTMLDivElement>();
    createEffect(() => {
        const ref = tabsRef();
        if (!ref) { return; }

        setIsOverflow(false);
        setIsOverflow(layout === 'horizontal'
            ? ref.scrollWidth > ref.clientWidth
            : ref.scrollHeight > ref.clientHeight);
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
                <button class={styles.prev} onclick={e=>scroll(e, -40)}>
                    <IconPrev class={layout === 'vertical' ? 'rotate-90' : ''} />
                </button>
                <div class={styles.scroller} onwheel={wheel} ref={el=>scrollerRef=el}>
                    <For each={props.items}>
                        {item => (
                            <button role='tab' aria-selected={val() == item[0]}
                                class={joinClass(styles.item, val() === item[0] ? styles.select : '')}
                                onClick={() => { change(item[0], props.value); }}
                            >
                                {item[1]}
                            </button>
                        )}
                    </For>
                </div>
                <button class={styles.next} onclick={e=>scroll(e, 40)}>
                    <IconNext class={layout === 'vertical' ? 'rotate-90' : ''} />
                </button>
            </Show>
            <Show when={!isOverflow()}>
                <For each={props.items}>
                    {item => (
                        <button role='tab' aria-selected={val() == item[0]}
                            class={joinClass(styles.item, val() === item[0] ? styles.select : '')}
                            onClick={() => { change(item[0], props.value); }}
                        >
                            {item[1]}
                        </button>
                    )}
                </For>
            </Show>
        </div>

        <Show when={props.children}>
            <div role="tabpanel">{props.children}</div>
        </Show>
    </div>;
}
