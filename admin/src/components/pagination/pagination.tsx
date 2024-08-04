// SPDX-FileCopyrightText: 2024 caixw
//
// SPDX-License-Identifier: MIT

import { createEffect, createSignal, For, mergeProps } from 'solid-js';

import { BaseProps } from '@/components/base';
import { useInternal } from '@/app/context';

export interface Props extends BaseProps {
    /**
     * 总的页码数量
     */
    count: number;

    /**
     * 当前页的页码，取值范围为 [1, {@link Props#count}]。
     */
    value: number;

    /**
     * 在页码改变的时候触发
     */
    onChange?: {(current: number, old?: number): void};

    /**
     * 按钮的数据
     */
    spans?: number;
}

const defaultProps: Readonly<Partial<Props>> = {
    spans: 3
};


/**
 * 分页组件
 * 
 * 大致布局如下：
 *  [<<,<,1,2,...,current...,7,8,>,>>]
 */
export default function(props: Props) {
    props = mergeProps(defaultProps, props);

    const ctx = useInternal();

    if (props.value < 1 || props.value > props.count) {
        throw 'props.value 的取值范围为 [1, props.count]';
    }

    const [prevs, setPrevs] = createSignal<Array<number>>([]);
    const [nexts, setNexts] = createSignal<Array<number>>([]);
    const [current, setCurrent] = createSignal(props.value);

    createEffect(()=>{
        let min = current() - props.spans!;
        if (min <= 1) {
            min = 1;
        }
        const pv: Array<number> = [];
        for(let i = min; i < current(); i++) {
            pv.push(i);
        }
        setPrevs(pv);

        let max = current() + props.spans!;
        if (max >= props.count) {
            max = props.count;
        }
        const nv: Array<number> = [];
        for(let i = current()+1; i <= max; i++) {
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
        <button onclick={()=>change(1)}
            class="item material-symbols-outlined"
            disabled={current()===1}
            title={ctx.t('_internal.pagination.firstPage')}>first_page</button>

        <button onclick={()=>change(current()-1)}
            class="item material-symbols-outlined"
            disabled={current()===1}
            title={ctx.t('_internal.pagination.prev')}>chevron_left</button>

        <For each={prevs()}>
            {(item)=>(
                <button onclick={()=>change(item)} class="item">{item}</button>
            )}
        </For>

        <button class="item current">{current()}</button>

        <For each={nexts()}>
            {(item)=>(
                <button onclick={()=>change(item)} class="item">{item}</button>
            )}
        </For>

        <button onclick={()=>change(current()+1)}
            class="item material-symbols-outlined"
            title={ctx.t('_internal.pagination.next')}
            disabled={current() >= props.count}>chevron_right</button>

        <button onclick={()=>change(props.count)}
            class="item material-symbols-outlined"
            title={ctx.t('_internal.pagination.lastPage')}
            disabled={current() >= props.count}>last_page</button>
    </div>;
}