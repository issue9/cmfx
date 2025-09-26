// SPDX-FileCopyrightText: 2025 caixw
//
// SPDX-License-Identifier: MIT

import { adjustPopoverPosition, pointInElement } from '@cmfx/core';
import { createSignal, JSX, mergeProps, ParentProps, splitProps } from 'solid-js';

import { AvailableEnumType, joinClass } from '@/base';
import { default as Menu, Props as MenuProps, Ref as MenuRef } from './menu';
import styles from './style.module.css';

export interface Ref {
    /**
     * 显示下拉的菜单
     */
    show(): void;

    /**
     * 隐藏下拉的菜单
     */
    hide(): void;

    /**
     * 组件的根元素
     */
    element(): HTMLDivElement;

    /**
     * 下拉菜单的元素
     */
    menu(): MenuRef;
}

export interface Props<M extends boolean = false, T extends AvailableEnumType = string>
    extends ParentProps, Omit<MenuProps<M, T>, 'layout' | 'tag' | 'ref'> {
    /**
     * 触发方式
     *
     * @defaultValue 'click'
     * @remarks 下拉菜单的打开的方式，可以是以下值：
     *  - click 鼠标点击；
     *  - hover 鼠标悬停，*移动端不支持*；
     *  - contextmenu 右键菜单；
     *  - custom 自定义，可通过 {@link Ref} 控制；
     */
    trigger?: 'click' | 'hover' | 'contextmenu' | 'custom';

    /**
     * 下拉菜单弹出时的回调函数
     */
    onPopover?: { (visible: boolean): void; };

    ref?: { (el: Ref): void; };
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
    props = mergeProps({ trigger: 'click' as Props['trigger'] }, props);

    const [_, menuProps] = splitProps(props, ['trigger', 'children', 'items', 'ref', 'onChange', 'class']);
    const [triggerRef, setTriggerRef] = createSignal<HTMLDivElement>();
    let menuRef: MenuRef;
    let rootRef: HTMLDivElement;
    let isOpen = false;

    const show = () => {
        menuRef.element().showPopover();
        adjustPopoverPosition(menuRef.element(), triggerRef()!.getBoundingClientRect(), 0, 'bottom', 'end');
    };

    return <div class={props.class} ref={el => rootRef = el}>
        <div aria-haspopup ref={el => setTriggerRef(el)} onmouseenter={() => {
            if (props.trigger !== 'hover' || !menuRef) { return; }
            show();
        }} onmouseleave={e => {
            if (props.trigger !== 'hover' || !menuRef) { return; }

            if (!pointInElement(e.clientX, e.clientY, menuRef.element())) { menuRef.element().hidePopover(); }
        }} oncontextmenu={e => {
            if (props.trigger !== 'contextmenu' || !menuRef) { return; }

            e.preventDefault();
            menuRef.element().showPopover();
            adjustPopoverPosition(menuRef.element(), new DOMRect(e.clientX, e.clientY, 1, 1));
        }} onclick={e => {
            if (props.trigger !== 'click' || !menuRef) { return; }

            e.preventDefault();
            e.stopPropagation();
            if (!isOpen) { show(); }
        }}>{props.children}</div>

        <Menu layout='vertical' tag='menu' {...menuProps} items={props.items}
            class={joinClass(undefined, styles.dropdown)}
            ref={el => {
                el.element().popover = 'auto';
                menuRef = el;

                el.element().onmouseleave = e => {
                    if (props.trigger !== 'hover') { return; }
                    if (!pointInElement(e.clientX, e.clientY, triggerRef()!)) {
                        el.element().hidePopover();
                    }
                };

                el.element().ontoggle = (e: ToggleEvent) => {
                    isOpen = e.newState === 'open';
                    if (props.onPopover) { props.onPopover(isOpen); }
                };

                if (props.ref) {
                    props.ref({
                        show: show,
                        hide: () => el.element().hidePopover(),
                        element: () => rootRef,
                        menu: () => el,
                    });
                }
            }}
            onChange={(val, old) => {
                if (props.onChange) { props.onChange(val, old); }
                if (!props.multiple) { menuRef.element().hidePopover(); }
            }}
        />
    </div>;
}
