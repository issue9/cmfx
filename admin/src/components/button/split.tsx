// SPDX-FileCopyrightText: 2024 caixw
//
// SPDX-License-Identifier: MIT

import { createSignal, For, JSX, Match, mergeProps, splitProps, Switch } from 'solid-js';

import { Dropdown } from '@/components/dropdown';
import { Props as BaseProps, default as Button, defaultProps } from './button';
import { default as Group } from './group';
import { ClickFunc } from './types';

type Item = { type: 'divider' } | {
    type: 'item';
    label: JSX.Element;
    onClick: ClickFunc;
};

export interface Props extends BaseProps {
    menus: Array<Item>;
}

/**
 * 带有一个默认操作的一组按钮
 *
 * 属性中，除了 menus 用于表示所有的子命令外，其它属性都是用于描述默认按钮的属性的。
*/
export default function(props: Props) {
    props = mergeProps(defaultProps, props);

    const [visible, setVisible] = createSignal(false);

    const [_, btnProps] = splitProps(props, ['style', 'rounded', 'disabled', 'palette']);

    const activator = <Group style={props.style} rounded={props.rounded} disabled={props.disabled}>
        <Button {...btnProps}>{props.children}</Button>
        <Button icon={/*@once*/true} onClick={()=>setVisible(!visible())}>keyboard_arrow_down</Button>
    </Group>;

    return <Dropdown class="c--split-button_content" palette={props.palette} activator={activator} visible={visible()} setVisible={setVisible}>
        <For each={props.menus}>
            {(item)=>(
                <Switch>
                    <Match when={item.type === 'divider'}>
                        <hr class="text-palette-bg-low" />
                    </Match>
                    <Match when={item.type === 'item'}>
                        <button onClick={(item as any).onClick}>{(item as any).label}</button>
                    </Match>
                </Switch>
            )}
        </For>
    </Dropdown>;
}
