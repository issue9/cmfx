// SPDX-FileCopyrightText: 2024 caixw
//
// SPDX-License-Identifier: MIT

import { createSignal, For, JSX, Match, Show, Switch } from 'solid-js';
import { Dynamic } from 'solid-js/web';

import { BaseProps, renderElementProp } from '@/components/base';
import { Divider } from '@/components/divider';
import type { Item, Value } from './item';

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
     * 可点击的元素是否以 A 作为标签名
     *
     * 如果为 true，那为 {@link Item#value} 将作为链接的值。
     */
    anchor?: boolean;
}

export default function (props: Props): JSX.Element {
    const [selected, setSelected] = createSignal<Value>();

    const Items = (p: { items: Array<Item>, indent: number }): JSX.Element => {
        return <For each={p.items}>
            {(item) => (
                <Switch>
                    <Match when={item.type === 'divider'}>
                        <Divider />
                    </Match>
                    <Match when={item.type === 'group'}>
                        <Group item={item} indent={p.indent} />
                    </Match>
                    <Match when={item.type === 'item'}>
                        <I item={item} indent={p.indent} />
                    </Match>
                </Switch>
            )}
        </For>;
    };

    // 渲染 type==item 的元素
    const I = (p: { item: Item, indent: number }) => {
        if (p.item.type !== 'item') {
            throw 'item.type 只能是 item';
        }

        const [open, setOpen] = createSignal(false);

        return <Switch>
            <Match when={p.item.items && p.item.items.length > 0}>
                <details class="items" onToggle={()=>setOpen(!open())} open={open()}>
                    <summary  style={{ 'margin-left': `${p.indent}` + 'px' }} class="item">
                        {renderElementProp(p.item.label)}
                        <span class="tail material-symbols-outlined">{ open() ?'keyboard_arrow_up' : 'keyboard_arrow_down' }</span>
                    </summary>
                    <Show when={p.item.items}>
                        <menu>
                            <Items items={p.item.items as Array<Item>} indent={p.indent+10} />
                        </menu>
                    </Show>
                </details>
            </Match>
            <Match when={!p.item.items}>
                <Dynamic component={props.anchor ? 'A' : 'span'} href={props.anchor ? p.item.value : undefined} onClick={()=>{
                    if (p.item.type !== 'item') { throw 'p.item.type 必须为 item'; }

                    const old = selected();
                    if (!props.onChange || old === p.item.value) { return; }

                    setSelected(p.item.value);
                    props.onChange(p.item.value, old);
                }} style={{ 'margin-left': `${p.indent}` + 'px' }} classList={{
                    'item': true,
                    'selected': selected() === p.item.value
                }}>
                    {renderElementProp(p.item.label)}
                </Dynamic>
            </Match>
        </Switch>;
    };

    // 渲染 type==group 的元素
    const Group = (p: { item: Item, indent: number }): JSX.Element => {
        if (p.item.type !== 'group') {
            throw 'item.type 只能是 group';
        }

        return <>
            <p class="group">{renderElementProp(p.item.label)}</p>
            <Items items={p.item.items} indent={p.indent} />
        </>;
    };

    return <menu role="menu" classList={{
        'c--list': true,
        [`palette--${props.palette}`]: !!props.palette
    }}>
        <Items items={props.children} indent={0} />
    </menu>;
}