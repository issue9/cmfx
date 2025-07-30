// SPDX-FileCopyrightText: 2025 caixw
//
// SPDX-License-Identifier: MIT

import { adjustPopoverPosition } from '@cmfx/core';
import { createSignal, JSX, onCleanup, onMount, splitProps } from 'solid-js';

import { default as Menu, Props as MenuProps, Ref } from './menu';

export type { Ref } from './menu';

export type Props = Omit<MenuProps<false>, 'layout' | 'tag' | 'multiple' | 'arrowUp' | 'arrowDown' | 'arrowRight'> & {
    /**
     * 用于触发右键的元素
     */
    target: HTMLElement;
};

/**
 * 右键菜单
 */
export default function ContextMenu(props: Props): JSX.Element {
    const [_, menuProps] = splitProps(props, ['items', 'ref', 'target', 'onChange']);
    const [ref, setRef] = createSignal<Ref>();

    props.target.addEventListener('contextmenu', e => {
        const r = ref();
        if (!r) { return; }

        e.preventDefault();
        r.hidePopover();
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

    return <Menu layout='inline' tag='menu' {...menuProps} items={props.items} multiple={false}
        onChange={(val, old) => {
            if (props.onChange) { props.onChange(val, old); }
            ref()?.hidePopover();
        }}
        ref={el => {
            el.popover = 'manual';
            setRef(el);
            if (props.ref) { props.ref(el); }
        }}
    />;
}
