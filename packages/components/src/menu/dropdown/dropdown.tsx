// SPDX-FileCopyrightText: 2025 caixw
//
// SPDX-License-Identifier: MIT

import { adjustPopoverPosition, pointInElement } from '@cmfx/core';
import { createSignal, JSX, mergeProps, onCleanup, onMount, ParentProps, splitProps } from 'solid-js';

import { AvailableEnumType, joinClass, RefProps } from '@/base';
import { Menu, MenuProps, MenuRef } from '@/menu';
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
    extends ParentProps, Omit<MenuProps<M, T>, 'layout' | 'tag' | 'ref'>, RefProps<Ref> {
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
     *
     * @remarks 下拉菜单弹出时的回调函数，其原型为 `(visible: boolean): boolean`，
     * visible 参数表示当前是否为可见状态，返回值为 `true` 时，将阻止下拉菜单的弹出。
     */
    onPopover?: { (visible: boolean): boolean | undefined; };
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

    const [_, menuProps] = splitProps(props, ['trigger', 'children', 'items', 'ref', 'onChange', 'class', 'style']);
    const [triggerRef, setTriggerRef] = createSignal<HTMLDivElement>();
    let menuRef: MenuRef;
    let rootRef: HTMLDivElement;
    let isOpen = false;

    const show = () => {
        if (isOpen) { return; }

        menuRef.element().showPopover();
        adjustPopoverPosition(menuRef.element(), triggerRef()!.getBoundingClientRect(), 0, 'bottom', 'end');
    };

    // 右键菜单需要对弹出和隐藏进行额外控制
    if (props.trigger === 'contextmenu') {
        const handleEsc = (e: KeyboardEvent) => {
            if (e.key === 'Escape') { menuRef.element().hidePopover(); }
        };

        const click = (e: MouseEvent) => {
            if (!menuRef.element().contains(e.target as HTMLElement)) {
                menuRef.element().hidePopover();
            }
        };

        onMount(() => {
            document.addEventListener('keydown', handleEsc);
            document.addEventListener('click', click);
        });
        onCleanup(() => {
            document.removeEventListener('keydown', handleEsc);
            document.removeEventListener('click', click);
        });
    }

    return <div class={joinClass(props.palette, props.class)} style={props.style} ref={el => rootRef = el}>
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
                el.element().tabIndex = -1;
                el.element().popover = props.trigger === 'contextmenu' ? 'manual' : 'auto';
                menuRef = el;

                el.element().onmouseleave = e => {
                    if (props.trigger !== 'hover') { return; }
                    if (!pointInElement(e.clientX, e.clientY, triggerRef()!)) {
                        el.element().hidePopover();
                    }
                };

                el.element().onbeforetoggle = (e: ToggleEvent) => {
                    if (props.onPopover && props.onPopover(e.newState === 'open')) {
                        e.preventDefault();
                    }
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
