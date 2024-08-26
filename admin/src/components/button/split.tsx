// SPDX-FileCopyrightText: 2024 caixw
//
// SPDX-License-Identifier: MIT

import { createSignal, For, JSX, Match, mergeProps, splitProps, Switch } from 'solid-js';

import { Corner } from '@/components/base';
import { Dropdown } from '@/components/dropdown';
import { Props as BaseProps, default as Button, defaultProps as defaultBaseProps } from './button';
import { default as Group } from './group';
import { ClickFunc } from './types';

type Item = { type: 'divider' } | {
    type: 'item';
    label: JSX.Element;
    onClick: ClickFunc;
    disabled?: boolean;
};

export interface Props extends BaseProps {
    pos?: Corner;
    menus: Array<Item>;
}

const defaultProps = {
    ...defaultBaseProps,
    pos: 'bottomleft' as Corner
};

/**
 * 带有一个默认操作的一组按钮
 *
 * 属性中，除了 menus 用于表示所有的子命令外，其它属性都是用于描述默认按钮的属性的。
*/
export default function(props: Props) {
    props = mergeProps(defaultProps, props);

    const [visible, setVisible] = createSignal(false);

    const [_, btnProps] = splitProps(props, ['style', 'rounded', 'disabled', 'palette', 'pos']);

    const activator = <Group style={props.style} rounded={props.rounded} disabled={props.disabled}>
        <Button {...btnProps}>{props.children}</Button>
        <Button icon={/*@once*/true} onClick={()=>setVisible(!visible())}>keyboard_arrow_down</Button>
    </Group>;

    return <Dropdown class="c--split-button_content" pos={props.pos} palette={props.palette} activator={activator} visible={visible()} setVisible={setVisible}>
        <For each={props.menus}>
            {(item)=>(
                <Switch>
                    <Match when={item.type === 'divider'}>
                        <hr class="text-palette-bg-low" />
                    </Match>
                    <Match when={item.type === 'item'}>
                        <button disabled={(item as any).disabled} class="whitespace-nowrap c--icon-container" onClick={() => {
                            (item as any).onClick();
                            setVisible(false);
                        }}>{(item as any).label}</button>
                    </Match>
                </Switch>
            )}
        </For>
    </Dropdown>;
}
