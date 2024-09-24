// SPDX-FileCopyrightText: 2024 caixw
//
// SPDX-License-Identifier: MIT

import { A, useLocation } from '@solidjs/router';
import { createSignal, For, JSX, Match, mergeProps, Show, Switch } from 'solid-js';
import { Dynamic } from 'solid-js/web';

import { Divider } from '@/components/divider';
import type { Props as ContainerProps } from '@/components/tree/container';
import { findItems, type Item, type Value } from '@/components/tree/item';

export interface Props extends ContainerProps {
    /**
     * 设置选中项的初始值
     *
     * NOTE: 该值为非响应属性。
     */
    selected?: Value;

    /**
     * 当选择项发生变化时触发的事件
     */
    onChange?: { (selected: Value, old?: Value): void };

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
    selectedClass: 'selected'
};

/**
 * 列表组件
 */
export default function (props: Props): JSX.Element {
    props = mergeProps(presetProps, props);

    const [selected, setSelected] = createSignal<Value|undefined>(props.selected ?? (props.anchor ? useLocation().pathname : undefined));
    const selectedIndexes = findItems(props.children, selected());

    const All = (p: { items: Array<Item>, indent: number, selectedIndex: number }): JSX.Element => {
        return <For each={p.items}>
            {(item, index) => {
                const isSelected = !!selectedIndexes && (p.selectedIndex >= 0) && (index() >= 0) && (index() === selectedIndexes[p.selectedIndex]);
                const selectedIndex = isSelected ? p.selectedIndex + 1 : -100;

                return <Switch>
                    <Match when={item.type === 'divider'}>
                        <Divider />
                    </Match>
                    <Match when={item.type === 'group'}>
                        <p class="group">{(item as any).label}</p>
                        <All items={(item as any).items} indent={p.indent} selectedIndex={selectedIndex} />
                    </Match>
                    <Match when={item.type === 'item'}>
                        <Items item={item} indent={p.indent} selectedIndex={selectedIndex} isSelected={isSelected} />
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

        // 这里始终初台为 false，details#onToggle 在初始化 details#open 时会被调用一次。
        // 可以在那里将 open 初始化为一个正确的值。
        const [open, setOpen] = createSignal(false);

        return <Switch>
            <Match when={p.item.items && p.item.items.length > 0}>
                <details open={p.isSelected} onToggle={()=>setOpen(!open())}>
                    <summary style={{ 'padding-left': `calc(${p.indent} * var(--item-space))` }} class="item">
                        {p.item.label}
                        <span class="tail c--icon">{ open() ? 'keyboard_arrow_up' : 'keyboard_arrow_down' }</span>
                    </summary>
                    <Show when={p.item.items}>
                        <menu>
                            <All items={p.item.items!} indent={p.indent+1} selectedIndex={p.selectedIndex} />
                        </menu>
                    </Show>
                </details>
            </Match>
            <Match when={!p.item.items}>
                <Dynamic component={props.anchor ? A : 'span'}
                    activeClass={props.selectedClass}
                    href={props.anchor ? (p.item.value?.toString() ?? '') : ''}
                    accessKey={p.item.accesskey}
                    style={{ 'padding-left': `calc(${p.indent} * var(--item-space))` }}
                    classList={{
                        'item': true,

                        // anchor 的类型定义在 activeClass 属性
                        [props.anchor ? '' : props.selectedClass!]: !!props.selectedClass && selected() === p.item.value
                    }}
                    onClick={()=>{
                        if (p.item.type !== 'item') { throw 'p.item.type 必须为 item'; }

                        const old = selected();
                        if (old === p.item.value) { return; }

                        if (props.onChange && p.item.value) {
                            props.onChange(p.item.value, old);
                        }

                        setSelected(p.item.value);
                    }}>{p.item.label}</Dynamic>
            </Match>
        </Switch>;
    };

    return <menu role="menu" classList={{
        'c--list': true,
        [`palette--${props.palette}`]: !!props.palette
    }}>
        <All items={props.children} indent={1} selectedIndex={0} />
    </menu>;
}
