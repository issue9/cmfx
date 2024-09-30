// SPDX-FileCopyrightText: 2024 caixw
//
// SPDX-License-Identifier: MIT

import { For, JSX, Match, mergeProps, onCleanup, onMount, splitProps, Switch } from 'solid-js';

import { Props as BaseProps, default as Button, presetProps } from './button';
import { default as Group, Ref as GroupRef } from './group';
import { ClickFunc } from './types';
import { calcPopoverPos } from '@/components/utils';

type Item = { type: 'divider' } | {
    type: 'item';
    label: JSX.Element;
    onClick: ClickFunc;
    disabled?: boolean;
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
    props = mergeProps(presetProps, props);
    let pop: HTMLDivElement;
    let group: GroupRef;

    const handleClick = (e: MouseEvent) => {
        if (!pop.contains(e.target as Node) && !group.contains(e.target as Node)) {
            pop.hidePopover();
        }
    };
    onMount(() => {
        document.body.addEventListener('click', handleClick);
    });
    onCleanup(() => {
        document.body.removeEventListener('click', handleClick);
    });

    const [_, btnProps] = splitProps(props, ['style', 'rounded', 'disabled', 'palette']);

    const activator = <Group palette={props.palette} ref={el=>group=el} style={props.style} rounded={props.rounded} disabled={props.disabled}>
        <Button {...btnProps}>{props.children}</Button>
        <Button icon={/*@once*/true} onClick={() => {
            pop.togglePopover();
            calcPopoverPos(pop, group.getBoundingClientRect());
        }}>keyboard_arrow_down</Button>
    </Group>;

    return <>
        {activator}
        <div ref={el=>pop=el} popover="manual" classList={{ 'c--split-button_content':true, [`palette--${props.palette}`]:!!props.palette}}>
            <For each={props.menus}>
                {(item) => (
                    <Switch>
                        <Match when={item.type === 'divider'}>
                            <hr class="text-palette-bg-low" />
                        </Match>
                        <Match when={item.type === 'item'}>
                            <button disabled={(item as any).disabled} class="whitespace-nowrap c--icon-container" onClick={() => {
                                (item as any).onClick();
                                pop.hidePopover();
                            }}>{(item as any).label}</button>
                        </Match>
                    </Switch>
                )}
            </For>
        </div>
    </>;
}
