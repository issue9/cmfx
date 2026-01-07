// SPDX-FileCopyrightText: 2025-2026 caixw
//
// SPDX-License-Identifier: MIT

import { JSX, mergeProps, onCleanup, onMount, ParentProps, splitProps } from 'solid-js';
import IconArrowDown from '~icons/material-symbols/keyboard-arrow-down';

import { AvailableEnumType, Layout, RefProps } from '@/base';
import { Dropdown, DropdownProps, DropdownRef } from '@/menu/dropdown';
import { Button, Ref as ButtonRef } from './button';
import { ButtonGroup, Ref as ButtonGroupRef } from './group';
import styles from './style.module.css';
import { Props as BaseProps, presetProps as presetBaseProps } from './types';

export interface Ref extends DropdownRef {
    /**
     * 返回按按钮组的组件实例
     */
    group(): ButtonGroupRef;
}

export interface Props<M extends boolean = false, T extends AvailableEnumType = string>
    extends Omit<DropdownProps<M, T>, 'trigger' | 'ref'>, RefProps<Ref>, ParentProps, Omit<BaseProps, 'hotkey'> {
    /**
     * 按钮的布局
     */
    layout?: Layout;
}

export const presetProps: Readonly<Partial<Props>> = {
    ...presetBaseProps,
    layout: 'horizontal'
} as const;

export default function Split<M extends boolean = false, T extends AvailableEnumType = string>(
    props: Props<M, T>
): JSX.Element {
    props = mergeProps(presetProps, props) as Props<M, T>;

    let dropdownRef: DropdownRef;
    let arrowRef: ButtonRef;
    let groupRef: ButtonGroupRef;

    // 保证弹出菜单的宽度不小于 ButtonGroup
    onMount(() => {
        dropdownRef.menu().root().style.minWidth = groupRef.root().getBoundingClientRect().width + 'px';
    });

    const click = (e: MouseEvent) => {
        const target = e.target as HTMLElement;
        if (!dropdownRef.menu().root().contains(target) && !arrowRef.root().contains(target)) {
            dropdownRef.hide();
        }
    };
    onMount(() => { document.addEventListener('click', click); });
    onCleanup(() => { document.removeEventListener('click', click); });

    const [, dropProps] = splitProps(props, ['children', 'ref', 'kind', 'rounded', 'disabled', 'layout']);
    return <Dropdown ref={el => dropdownRef = el} {...dropProps} trigger='custom'>
        <ButtonGroup kind={props.kind} rounded={props.rounded} layout={props.layout}
            disabled={props.disabled} ref={el => {
                groupRef = el;
                if (props.ref) {
                    props.ref({
                        show: () => dropdownRef.show(),
                        hide: () => dropdownRef.hide(),
                        toggle: () => dropdownRef.toggle(),
                        root: () => dropdownRef.root(),
                        menu: () => dropdownRef.menu(),
                        group: () => el
                    });
                }
            }}
        >
            {props.children}
            <Button class={styles.split} square ref={el => arrowRef = el} onclick={() => {
                dropdownRef.toggle();
            }}><IconArrowDown /></Button>
        </ButtonGroup>
    </Dropdown>;
}
