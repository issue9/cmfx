// SPDX-FileCopyrightText: 2024 caixw
//
// SPDX-License-Identifier: MIT

import { BaseProps } from '@/components/base';
import { useInternal } from '@/app/context';
import { createEffect, createSignal, For, Show } from 'solid-js';

export interface Props extends BaseProps {
    /**
     * 总的页码数量
     */
    count: number;

    /**
     * 当前页的页码，基数为 1。
     */
    value: number;

    /**
     * 在页码改变的时候触发
     */
    onChange?: {(current: number, old?: number): void};
}

const size = 4;

/**
 * 分页组件
 * 
 * 大致布局如下：
 *  [prev] [first,1,2,...,current...,7,8,last] [next]
 */
export default function(props: Props) {
    const ctx = useInternal();

    if (props.value < 1 || props.value > props.count) {
        throw 'props.value 的取值范围为 [1, props.count]';
    }

    const [prevs, setPrevs] = createSignal<Array<number>>([]);
    const [nexts, setNexts] = createSignal<Array<number>>([]);
    const [current, setCurrent] = createSignal(props.value);

    createEffect(()=>{
        let min = current() - size;
        if (min <= 1) {
            min = 2;
        }
        const pv: Array<number> = [];
        for(let i = min; i < current(); i++) {
            pv.push(i);
        }
        setPrevs(pv);

        let max = current() + size;
        if (max >= props.count) {
            max = props.count-1;
        }
        const nv: Array<number> = [];
        for(let i = current()+1; i < props.count; i++) {
            nv.push(i);
        }
        setNexts(nv);
    });

    const change = (page: number) => {
        const old = current();
        setCurrent(page);
        if (props.onChange) {
            props.onChange(page, old);
        }
    };

    return <div classList={{
        'c--pagination': true,
        [`palette--${props.palette}`]: !!props.palette
    }}>
        <button onclick={()=>change(current()-1)} class="item prev" disabled={current()===1}>
            {ctx.t('_internal.pagination.prev')}
        </button>

        <div class="item line">
            <Show when={current() > 1}>
                <button onclick={()=>change(1)} class="btn">1</button>
            </Show>

            <For each={prevs()}>
                {(item)=>(
                    <button onclick={()=>change(item)} class="btn">{item}</button>
                )}
            </For>

            <button class="btn current">{current()}</button>

            <For each={nexts()}>
                {(item)=>(
                    <button onclick={()=>change(item)} class="btn">{item}</button>
                )}
            </For>


            <Show when={current() < props.count}>
                <button onclick={()=>change(props.count)} class="btn">{props.count}</button>
            </Show>
        </div>

        <button onclick={()=>change(current()+1)} class="item next" disabled={current() >= props.count}>
            {ctx.t('_internal.pagination.next')}
        </button>
    </div>;
}