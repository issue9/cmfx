// SPDX-FileCopyrightText: 2025 caixw
//
// SPDX-License-Identifier: MIT

import { adjustPopoverPosition } from '@cmfx/core';
import { createSignal, JSX, onCleanup, onMount, splitProps } from 'solid-js';

import { AvailableEnumType, joinClass } from '@/base';
import { default as Menu, Props as MenuProps, Ref } from './menu';
import styles from './style.module.css';

export type { Ref } from './menu';

export type Props<T extends AvailableEnumType = string> = Omit<MenuProps<false, T>, 'layout' | 'tag' | 'multiple'> & {
    /**
     * 用于触发右键的元素
     */
    target: HTMLElement;

    /**
     * 下拉菜单弹出时的回调函数
     */
    onPopover?: { (visible: boolean): void; }
};

/**
 * 右键菜单
 *
 * @typeParam T - 选项类型；
 */
export default function ContextMenu<T extends AvailableEnumType = string>(props: Props<T>): JSX.Element {
    const [_, menuProps] = splitProps(props, ['items', 'ref', 'target', 'onChange', 'class']);
    const [ref, setRef] = createSignal<Ref>();

    props.target.addEventListener('contextmenu', e => {
        const r = ref();
        if (!r) { return; }

        e.preventDefault();
        r.showPopover();
        adjustPopoverPosition(r, new DOMRect(e.clientX, e.clientY, 1, 1));
    });

    const handleClick = (e: MouseEvent) => {
        if (!ref()?.contains(e.target as Node)) { ref()?.hidePopover(); }
    };
    const handleKeydown = (e: KeyboardEvent) => {
        if (e.key === 'Escape') { ref()?.hidePopover(); }
    };
    onMount(() => {
        document.addEventListener('click', handleClick);
        document.addEventListener('keydown', handleKeydown);
    });
    onCleanup(() => {
        document.removeEventListener('click', handleClick);
        document.removeEventListener('keydown', handleKeydown);
    });

    return <Menu layout='vertical' tag='menu' {...menuProps} items={props.items} multiple={false}
        class={joinClass(undefined, styles.context, props.class)}
        onChange={(val, old) => {
            if (props.onChange) { props.onChange(val, old); }
            ref()?.hidePopover();
        }}
        ref={el => {
            el.popover = 'manual';
            el.ontoggle = (e: ToggleEvent) => {
                if (props.onPopover) { props.onPopover(e.newState === 'open'); }
            };
            setRef(el);
            if (props.ref) { props.ref(el); }
        }}
    ></Menu>;
}
