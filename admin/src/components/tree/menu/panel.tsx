// SPDX-FileCopyrightText: 2024 caixw
//
// SPDX-License-Identifier: MIT

import { A } from '@solidjs/router';
import { createSignal, For, JSX, Match, mergeProps, Switch } from 'solid-js';
import { Dynamic } from 'solid-js/web';

import { Divider } from '@/components/divider';
import type { Props as ContainerProps } from '@/components/tree/container';
import { Item, Value } from '@/components/tree/item';

export type Ref = HTMLElement;

export interface Props extends ContainerProps {
    /**
     * 当选择项发生变化时触发的事件
     */
    onChange?: { (selected: Value, old?: Value): void };

    /**
     * 是否采用 {@link A} 标签
     *
     * 如果为 true，那为 {@link Item#value} 将作为链接的值。
     */
    anchor?: boolean;

    ref?: { (el: Ref): void; };

    popover?: boolean | 'auto' | 'manual';

    /**
     * 菜单展开的方向
     */
    direction?: 'left' | 'right';
}

export const presetProps: Readonly<Partial<Props>> = {
    selectedClass: 'selected',
    direction: 'right'
};

export default function (props: Props): JSX.Element {
    props = mergeProps(presetProps, props);
    const [selected, setSelected] = createSignal<Value>();

    const All = (p: { items: Array<Item> }): JSX.Element => {
        return <For each={p.items}>
            {(item) => (
                <Switch>
                    <Match when={item.type === 'divider'}>
                        <Divider />
                    </Match>
                    <Match when={item.type === 'group'}>
                        <p class="group">{(item as any).label}</p>
                        <All items={(item as any).items} />
                    </Match>
                    <Match when={item.type === 'item'}>
                        <Items item={item} />
                    </Match>
                </Switch>
            )}
        </For>;
    };

    // 渲染 type==item 的元素
    const Items = (p: { item: Item }) => {
        if (p.item.type !== 'item') {
            throw 'item.type 只能是 item';
        }

        return <Switch>
            <Match when={p.item.items && p.item.items.length > 0}>
                <li class="item">
                    {p.item.label}
                    <span class="tail c--icon">chevron_right</span>
                    <menu classList={{'c--menu':true,'hidden':true,[props.direction!]:true}}>
                        <All items={p.item.items as Array<Item>} />
                    </menu>
                </li>
            </Match>
            <Match when={!p.item.items}>
                <Dynamic component={props.anchor ? A : 'span'}
                    activeClass={props.selectedClass}
                    href={props.anchor ? (p.item.value?.toString() ?? '') : ''}
                    accessKey={p.item.accesskey}
                    classList={{
                        'item': true,
                        [props.selectedClass!]: !!props.selectedClass && selected() === p.item.value
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

    return <menu popover={props.popover} role="menu" ref={(el: Ref) => { if (props.ref) { props.ref(el); }}} classList={{
        'c--menu': true,
        [`palette--${props.palette}`]: !!props.palette
    }}><All items={props.children} /></menu>;
}