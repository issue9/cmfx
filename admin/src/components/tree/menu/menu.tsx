// SPDX-FileCopyrightText: 2024 caixw
//
// SPDX-License-Identifier: MIT

import { createSignal, For, JSX, Match, mergeProps, Show, Switch } from 'solid-js';

import { Divider } from '@/components/divider';
import type { Props as ContainerProps } from '@/components/tree/container';
import { Item, Value } from '@/components/tree/item';
import { sleep } from '@/core';

export interface Props extends ContainerProps {
    /**
     * 右侧展开子菜单的图标，默认为 chevron_right
     */
    expandIcon?: string

    /**
     * 点击菜单项之后自动关闭弹出的菜单
     */
    autoClose?: boolean;
}

const defaultProps: Readonly<Partial<Props>> = {
    expandIcon: 'chevron_right',
    selectedClass: 'selected'
};

export default function (props: Props): JSX.Element {
    props = mergeProps(defaultProps, props);

    const [selected, setSelected] = createSignal<Value>();

    // 在 props.autoClose 为 true 时，能正常关闭弹出的菜单。
    const [hide, setHide] = createSignal(false);

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
                    {p.item.label}
                    <span class="tail material-symbols-outlined">{ props.expandIcon }</span>
                    <Show when={p.item.items && !hide()}>
                        <menu class="c--menu hidden">
                            <Items items={p.item.items as Array<Item>} />
                        </menu>
                    </Show>
                </li>
            </Match>
            <Match when={!p.item.items}>
                <li accessKey={p.item.accesskey} onClick={()=>{
                    if (p.item.type !== 'item') { throw 'p.item.type 必须为 item'; }

                    if (props.autoClose) {
                        setHide(true);
                        sleep(500).then(()=>setHide(false));
                    }

                    const old = selected();
                    if (old === p.item.value) { return; }

                    if (props.onChange) {
                        props.onChange(p.item.value, old);
                    }

                    setSelected(p.item.value);
                }} classList={{
                    'item': true,
                    [props.selectedClass!]: !!props.selectedClass && selected() === p.item.value
                }}>
                    {p.item.label}
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
            <p class="group">{p.item.label}</p>
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
