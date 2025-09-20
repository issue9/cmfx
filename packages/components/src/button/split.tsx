// SPDX-FileCopyrightText: 2024-2025 caixw
//
// SPDX-License-Identifier: MIT

import { adjustPopoverPosition, Hotkey } from '@cmfx/core';
import { For, JSX, Match, mergeProps, onCleanup, onMount, splitProps, Switch } from 'solid-js';
import IconArrowDown from '~icons/material-symbols/keyboard-arrow-down';

import { classList } from '@/base';
import { Props as BaseProps, presetProps as basePrsetProps, Button, Ref } from './button';
import { ButtonGroup, Ref as GroupRef } from './group';
import styles from './style.module.css';

export type Item = { type: 'divider' } | {
    type: 'item';
    label: JSX.Element;
    onClick: NonNullable<BaseProps['onClick']>;
    disabled?: boolean;
    hotkey?: Hotkey;
};

export interface Props extends BaseProps {
    menus: Array<Item>;

    /**
     * 菜单展开的方向
     */
    direction?: 'left' | 'right';
}

const presetProps: Readonly<Partial<Props>> = {
    ...basePrsetProps,
    direction: 'right'
} as const;

/**
 * 带有一个默认操作的一组按钮
 *
 * 属性中，除了 menus 用于表示所有的子命令外，其它属性都是用于描述默认按钮的属性的。
*/
export function SplitButton(props: Props) {
    props = mergeProps(presetProps, props);
    let popElem: HTMLDivElement;
    let group: GroupRef;
    let downRef: Ref;

    onMount(() => {
        if (props.hotkey) { Hotkey.bind(props.hotkey, downRef.click); }
    });
    onCleanup(() => {
        if (props.hotkey) { Hotkey.unbind(props.hotkey); }
    });

    const [_, btnProps] = splitProps(props, ['style', 'rounded', 'disabled', 'palette', 'menus']);

    const activator = <ButtonGroup palette={props.palette} ref={el=>group=el}
        kind={props.kind} rounded={props.rounded} disabled={props.disabled}
    >
        <Button {...btnProps}>{props.children}</Button>
        <Button class={styles.split} ref={el=>downRef=el} square onClick={() => {
            popElem.togglePopover();

            const anchor = group.getBoundingClientRect();
            if (props.direction === 'left') {
                anchor.x = anchor.right - popElem.getBoundingClientRect().width;
            }

            adjustPopoverPosition(popElem, anchor, 0, 'bottom');
        }}><IconArrowDown /></Button>
    </ButtonGroup>;

    return <>
        {activator}
        <div ref={el => popElem = el} popover="auto"
            class={classList({ [`palette--${props.palette}`]: !!props.palette }, styles['split-content'])}
        >
            <For each={props.menus}>
                {(item) => {
                    let ref: Ref;
                    if (item.type === 'item' && item.hotkey) {
                        const hk = item.hotkey;
                        onMount(() => { Hotkey.bind(hk, () => { ref.click(); }); });
                        onCleanup(() => { Hotkey.unbind(hk); });
                    }
                    return <Switch>
                        <Match when={item.type === 'divider'}>
                            <hr class="border-palette-bg-low" />
                        </Match>
                        <Match when={item.type === 'item'}>
                            <Button ref={el => ref = el} kind='flat' disabled={(item as any).disabled}
                                class={styles['split-item']} onClick={() => {
                                    (item as any).onClick();
                                    popElem.hidePopover();
                                }}>{(item as any).label}</Button>
                        </Match>
                    </Switch>;
                }}
            </For>
        </div>
    </>;
}
