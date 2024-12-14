// SPDX-FileCopyrightText: 2024 caixw
//
// SPDX-License-Identifier: MIT

import { createEffect, createSignal, For, JSX, mergeProps } from 'solid-js';

import { useApp } from '@/components/context';
import { BaseProps } from '@/components/base';
import { Button } from '@/components/button';

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
    const ctx = useApp();

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

    return <nav classList={{
        'c--pagination': true,
        [`palette--${props.palette}`]: !!props.palette
    }}>
        <Button icon onclick={()=>change(1)} class="item"
            aria-label={ctx.locale().t('_i.pagination.firstPage')}
            disabled={current()===1}>first_page</Button>

        <Button icon onclick={()=>change(current()-1)} class="item" disabled={current()===1}
            aria-label={ctx.locale().t('_i.pagination.prev')}>chevron_left</Button>

        <For each={prevs()}>
            {(item)=>(
                <Button aria-label={item.toString()} onclick={()=>change(item)} class="item">{item}</Button>
            )}
        </For>

        <Button aria-label={current().toString()} aria-selected='true' class="item current">{current()}</Button>

        <For each={nexts()}>
            {(item)=>(
                <Button aria-label={item.toString()} onclick={()=>change(item)} class="item">{item}</Button>
            )}
        </For>

        <Button icon onclick={()=>change(current()+1)} class="item"
            aria-label={ctx.locale().t('_i.pagination.next')}
            disabled={current() >= props.count}>chevron_right</Button>

        <Button icon onclick={()=>change(props.count)} class="item"
            aria-label={ctx.locale().t('_i.pagination.lastPage')}
            disabled={current() >= props.count}>last_page</Button>
    </nav>;
}
