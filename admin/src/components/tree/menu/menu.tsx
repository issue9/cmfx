// SPDX-FileCopyrightText: 2024 caixw
//
// SPDX-License-Identifier: MIT

import { createSignal, For, JSX, Match, mergeProps, Show, Switch } from 'solid-js';

import { BaseProps, renderElementProp } from '@/components/base';
import { Divider } from '@/components/divider';
import type { Item, Value } from '@/components/tree/item';

export interface Props extends BaseProps {
    /**
     * 子项
     */
    children: Array<Item>;

    /**
     * 当选择项发生变化时触发的事件
     */
    onChange?: { (selected: Value, old?: Value): void };

    /**
     * 右侧展开子菜单的图标，默认为 chevron_right
     */
    expandIcon?: string
}

const defaultProps: Readonly<Partial<Props>> = {
    expandIcon: 'chevron_right'
};

export default function (props: Props): JSX.Element {
    props = mergeProps(defaultProps, props);

    const [selected, setSelected] = createSignal<Value>();

    const Items = (p: { items: Array<Item> }): JSX.Element => {
        return <For each={p.items}>
            {(item) => (
                <Switch>
                    <Match when={item.type === 'divider'}>
                        <Divider />
                    </Match>
                    <Match when={item.type === 'group'}>
                        <Group item={item} />
                    </Match>
                    <Match when={item.type === 'item'}>
                        <I item={item} />
                    </Match>
                </Switch>
            )}
        </For>;
    };

    // 渲染 type==item 的元素
    const I = (p: { item: Item }) => {
        if (p.item.type !== 'item') {
            throw 'item.type 只能是 item';
        }

        return <Switch>
            <Match when={p.item.items && p.item.items.length > 0}>
                <li class="item">
                    {renderElementProp(p.item.label)}
                    <span class="tail material-symbols-outlined">{ props.expandIcon }</span>
                    <Show when={p.item.items}>
                        <menu class="c--menu hidden">
                            <Items items={p.item.items as Array<Item>} />
                        </menu>
                    </Show>
                </li>
            </Match>
            <Match when={!p.item.items}>
                <li onClick={()=>{
                    if (p.item.type !== 'item') { throw 'p.item.type 必须为 item'; }

                    const old = selected();
                    if (!props.onChange || old === p.item.value) { return; }

                    setSelected(p.item.value);
                    props.onChange(p.item.value, old);
                }} classList={{
                    'item': true,
                    'selected': selected() === p.item.value
                }}>
                    {renderElementProp(p.item.label)}
                </li>
            </Match>
        </Switch>;
    };

    // 渲染 type==group 的元素
    const Group = (p: { item: Item }): JSX.Element => {
        if (p.item.type !== 'group') {
            throw 'item.type 只能是 group';
        }

        return <>
            <p class="group">{renderElementProp(p.item.label)}</p>
            <Items items={p.item.items} />
        </>;
    };

    return <menu role="menu" classList={{
        'c--menu': true,
        [`palette--${props.palette}`]: !!props.palette
    }}>
        <Items items={props.children} />
    </menu>;
}
