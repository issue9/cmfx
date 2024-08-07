// SPDX-FileCopyrightText: 2024 caixw
//
// SPDX-License-Identifier: MIT

import { createSignal, For, JSX, Match, mergeProps, Show, Switch } from 'solid-js';
import { Dynamic } from 'solid-js/web';

import { Divider } from '@/components/divider';
import type { Props as ContainerProps } from '@/components/tree/container';
import type { Item, Value } from '@/components/tree/item';

export interface Props extends ContainerProps {
    /**
     * 可点击的元素是否以 A 作为标签名
     *
     * 如果为 true，那为 {@link Item#value} 将作为链接的值。
     */
    anchor?: boolean;
}

const defaultProps: Readonly<Partial<Props>> = {
    selectedClass: 'selected'
};

export default function (props: Props): JSX.Element {
    props = mergeProps(defaultProps, props);

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
                <details onToggle={()=>setOpen(!open())} open={open()}>
                    <summary style={{ 'padding-left': `calc(${p.indent} * var(--item-space))` }} class="item">
                        {p.item.label}
                        <span class="tail material-symbols-outlined">{ open() ?'keyboard_arrow_up' : 'keyboard_arrow_down' }</span>
                    </summary>
                    <Show when={p.item.items}>
                        <menu>
                            <Items items={p.item.items as Array<Item>} indent={p.indent+1} />
                        </menu>
                    </Show>
                </details>
            </Match>
            <Match when={!p.item.items}>
                <Dynamic component={props.anchor ? 'A' : 'span'} href={props.anchor ? p.item.value : undefined} accessKey={p.item.accesskey} onClick={()=>{
                    if (p.item.type !== 'item') { throw 'p.item.type 必须为 item'; }

                    const old = selected();
                    if (old === p.item.value) { return; }

                    if (props.onChange && p.item.value) {
                        props.onChange(p.item.value, old);
                    }

                    setSelected(p.item.value);
                }} style={{ 'padding-left': `calc(${p.indent} * var(--item-space))` }} classList={{
                    'item': true,
                    [props.selectedClass!]: props.selectedClass && selected() === p.item.value
                }}>
                    {p.item.label}
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
            <p class="group">{p.item.label}</p>
            <Items items={p.item.items} indent={p.indent} />
        </>;
    };

    return <menu role="menu" classList={{
        'c--list': true,
        [`palette--${props.palette}`]: !!props.palette
    }}>
        <Items items={props.children} indent={1} />
    </menu>;
}
