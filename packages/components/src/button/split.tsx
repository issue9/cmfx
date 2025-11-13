// SPDX-FileCopyrightText: 2024-2025 caixw
//
// SPDX-License-Identifier: MIT

import { adjustPopoverPosition, Hotkey } from '@cmfx/core';
import { For, JSX, Match, mergeProps, onCleanup, onMount, splitProps, Switch } from 'solid-js';
import IconArrowDown from '~icons/material-symbols/keyboard-arrow-down';

import { handleEvent, joinClass } from '@/base';
import { Props as BaseProps, presetProps as basePrsetProps, Button, Ref } from './button';
import { ButtonGroup, Ref as GroupRef } from './group';
import styles from './style.module.css';

export type Item = { type: 'divider' } | {
    /**
     * 按钮类型
     */
    type: BaseProps['type'];

    /**
     * 按钮上的内容
     */
    label: JSX.Element;

    /**
     * 点击事件
     */
    onclick?: NonNullable<BaseProps['onclick']>;

    /**
     * 如果 type=='a'，则为跳转的链接
     */
    href?: string;

    /**
     * 禁用状态
     */
    disabled?: boolean;

    /**
     * 快捷键
     */
    hotkey?: Hotkey;

    /**
     * 是否选中
     */
    checked?: boolean;
};

export interface Props extends BaseProps {
    menus: Array<Item>;

    /**
     * 菜单展开的方向
     *
     * @reactive
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
 * @remarks
 * 属性中，除了 menus 和 palette 用于表示所有的子命令外，其它属性都是用于描述默认按钮的属性的。
*/
export function SplitButton(props: Props) {
    props = mergeProps(presetProps, props);
    let popRef: HTMLDivElement;
    let groupRef: GroupRef;
    let downRef: Ref;

    onMount(() => {
        if (props.hotkey) { Hotkey.bind(props.hotkey, downRef.element().click); }
    });
    onCleanup(() => {
        if (props.hotkey) { Hotkey.unbind(props.hotkey); }
    });

    const [_, btnProps] = splitProps(props, ['rounded', 'disabled', 'menus']);

    const activator = <ButtonGroup palette={props.palette} ref={el => groupRef = el}
        kind={props.kind} rounded={props.rounded} disabled={props.disabled}
    >
        <Button {...btnProps}>{props.children}</Button>
        <Button class={styles.split} ref={el => downRef = el} square onclick={() => {
            popRef.togglePopover();

            const anchor = groupRef.element().getBoundingClientRect();
            if (props.direction === 'left') {
                anchor.x = anchor.right - popRef.getBoundingClientRect().width;
            }

            adjustPopoverPosition(popRef, anchor, 0, 'bottom');
            popRef.style.minWidth = `${groupRef.element().offsetWidth}px`;
        }}><IconArrowDown /></Button>
    </ButtonGroup>;

    return <>
        {activator}
        <div ref={el => popRef = el} popover="auto" class={joinClass(props.palette, styles['split-pop'])}>
            <For each={props.menus}>
                {item =>
                    <Switch>
                        <Match when={item.type === 'divider'}>
                            <hr class="border-palette-border" />
                        </Match>
                        <Match when={item.type !== 'divider' ? item : undefined}>
                            {it => {
                                const click = it().onclick;
                                delete it().onclick;
                                return <Button kind='flat' {...it()}
                                    class={styles['split-item']} onclick={e => {
                                        click && handleEvent(click, e);
                                        popRef.hidePopover();
                                    }}>{it().label}</Button>;
                            }}
                        </Match>
                    </Switch>
                }
            </For>
        </div>
    </>;
}
