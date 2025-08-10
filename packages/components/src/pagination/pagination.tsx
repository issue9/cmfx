// SPDX-FileCopyrightText: 2024-2025 caixw
//
// SPDX-License-Identifier: MIT

import { createEffect, createSignal, For, JSX, mergeProps } from 'solid-js';
import IconPrev from '~icons/material-symbols/chevron-left';
import IconNext from '~icons/material-symbols/chevron-right';
import IconFirst from '~icons/material-symbols/first-page';
import IconLast from '~icons/material-symbols/last-page';

import { BaseProps, joinClass } from '@/base';
import { Button } from '@/button';
import { useLocale } from '@/context';
import styles from './style.module.css';

export interface Props extends BaseProps {
    /**
     * 总的页码数量
     */
    count: number;

    /**
     * 当前页的页码，取值范围为 [1, {@link Props#count}]。
     *
     * NOTE: 这是一个非响应式的属性。
     */
    value: number;

    /**
     * 在页码改变的时候触发
     */
    onChange?: { (current: number, old?: number): void };

    /**
     * 按钮的数量
     */
    spans?: number;
}

const presetProps: Readonly<Partial<Props>> = {
    spans: 3
};

/**
 * 分页组件
 *
 * 大致布局如下：
 *  [<<,<,1,2,...,current...,7,8,>,>>]
 */
export function Pagination(props: Props): JSX.Element {
    props = mergeProps(presetProps, props);
    const l = useLocale();

    const [prevs, setPrevs] = createSignal<Array<number>>([]);
    const [nexts, setNexts] = createSignal<Array<number>>([]);
    const [current, setCurrent] = createSignal(props.value);

    const change = (page: number) => {
        const old = current();
        setCurrent(page);
        if (props.onChange) {
            props.onChange(page, old);
        }
    };

    createEffect(() => {
        if (current() > props.count) {
            change(props.count);
        }

        let min = current() - props.spans!;
        if (min < 1) {
            min = 1;
        }
        const pv: Array<number> = [];
        if (current() > min) {
            for (let i = min; i < current(); i++) {
                pv.push(i);
            }
        }
        setPrevs(pv);

        let max = current() + props.spans!;
        if (max > props.count) {
            max = props.count;
        }
        const nv: Array<number> = [];
        if (current() < max) {
            for (let i = current() + 1; i <= max; i++) {
                nv.push(i);
            }
        }
        setNexts(nv);
    });

    return <nav class={joinClass(styles.pagination, props.palette ? `palette--${props.palette}`: '', props.class)}>
        <Button square onclick={() => change(1)} class={styles.item}
            aria-label={l.t('_c.pagination.firstPage')}
            disabled={current()===1}><IconFirst /></Button>

        <Button square onclick={() => change(current() - 1)} class={styles.item} disabled={current()===1}
            aria-label={l.t('_c.pagination.prev')}><IconPrev /></Button>

        <For each={prevs()}>
            {(item)=>(
                <Button square aria-label={item.toString()} onclick={()=>change(item)} class={styles.item}>{item}</Button>
            )}
        </For>

        <Button square aria-label={current().toString()} aria-selected='true' class={joinClass(styles.item, styles.current)}>{current()}</Button>

        <For each={nexts()}>
            {(item)=>(
                <Button square aria-label={item.toString()} onclick={()=>change(item)} class={styles.item}>{item}</Button>
            )}
        </For>

        <Button square onclick={()=>change(current()+1)}  class={styles.item}
            aria-label={l.t('_c.pagination.next')}
            disabled={current() >= props.count}><IconNext /></Button>

        <Button square onclick={()=>change(props.count)} class={styles.item}
            aria-label={l.t('_c.pagination.lastPage')}
            disabled={current() >= props.count}><IconLast /></Button>
    </nav>;
}
