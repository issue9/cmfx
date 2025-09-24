// SPDX-FileCopyrightText: 2025 caixw
//
// SPDX-License-Identifier: MIT

import { adjustPopoverPosition, pointInElement } from '@cmfx/core';
import { createSignal, JSX, ParentProps, splitProps } from 'solid-js';

import { AvailableEnumType, joinClass } from '@/base';
import { mergeProps } from 'solid-js';
import { default as Menu, Props as MenuProps, Ref as MenuRef } from './menu';
import styles from './style.module.css';

export type { Ref } from './menu';

export interface Props<M extends boolean = false, T extends AvailableEnumType = string> extends ParentProps,
    Omit<MenuProps<M, T>, 'layout' | 'tag'> {
    /**
     * 触发方式
     *
     * @defaultValue 'click'
     * @remarks 下拉菜单的打开的方式，在移动端不支持 hover 事件。
     */
    trigger: 'click' | 'hover' | 'contextmenu';

    /**
     * 下拉菜单弹出时的回调函数
     */
    onPopover?: { (visible: boolean): void; }
}

/**
 * 下拉菜单
 *
 * @typeParam M - 是否多选；
 * @typeParam T - 选项类型；
 */
export default function Dropdown<M extends boolean = false, T extends AvailableEnumType = string>(
    props: Props<M, T>
): JSX.Element {
    props = mergeProps({ trigger: 'click' }, props);

    const [_, menuProps] = splitProps(props, ['trigger', 'children', 'items', 'ref', 'onChange', 'class']);
    const [triggerRef, setTriggerRef] = createSignal<HTMLDivElement>();
    let popRef: MenuRef;
    let isOpen = false;

    return <>
        <div aria-haspopup ref={el => setTriggerRef(el)} onmouseenter={()=>{
            if (props.trigger !== 'hover') { return; }

            popRef.showPopover();
            adjustPopoverPosition(popRef, triggerRef()!.getBoundingClientRect(), 0, 'bottom', 'end');
        }} onmouseleave={e=>{
            if (props.trigger !== 'hover') { return; }

            if (!pointInElement(e.clientX, e.clientY, popRef)) { popRef.hidePopover(); }
        }} oncontextmenu={e=>{
            if (props.trigger !== 'contextmenu') { return; }

            e.preventDefault();
            popRef.showPopover();
            adjustPopoverPosition(popRef, new DOMRect(e.clientX, e.clientY, 1, 1));
        }} onclick={e=>{
            if (props.trigger !== 'click') { return; }

            e.preventDefault();
            e.stopPropagation();
            if (!isOpen) {
                popRef.showPopover();
                adjustPopoverPosition(popRef, triggerRef()!.getBoundingClientRect(), 0, 'bottom', 'end');
            }
        }}>{props.children}</div>
        <Menu layout='vertical' tag='menu' {...menuProps} items={props.items}
            class={joinClass(undefined, styles.dropdown, props.class)}
            ref={el => {
                el.popover = 'auto';
                popRef = el;

                popRef.onmouseleave = e => {
                    if (props.trigger !== 'hover') { return; }
                    if (!pointInElement(e.clientX, e.clientY, triggerRef()!)) { el.hidePopover(); }
                };

                popRef.ontoggle = (e: ToggleEvent) => {
                    isOpen = e.newState === 'open';
                    if (props.onPopover) { props.onPopover(isOpen); }
                };

                if (props.ref) { props.ref(el); }
            }}
            onChange={(val, old) => {
                if (props.onChange) { props.onChange(val, old); }
                if (!props.multiple) { popRef.hidePopover(); }
            }}
        />
    </>;
}
