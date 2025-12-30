// SPDX-FileCopyrightText: 2025 caixw
//
// SPDX-License-Identifier: MIT

import { adjustPopoverPosition, Hotkey, pointInElement, PopoverAlign } from '@cmfx/core';
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
     * 切换菜单的显示和关闭
     */
    toggle(): void;

    /**
     * 组件的根元素
     */
    root(): HTMLDivElement;

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

    /**
     * 快捷键
     */
    hotkey?: Hotkey;

    /**
     * 菜单展开的对齐方式
     *
     * @defaultValue 'end'
     * @reactive
     */
    align?: PopoverAlign;
}

const presetProps = {
    align: 'end',
    trigger: 'click',
} as const;

/**
 * 下拉菜单
 *
 * @typeParam M - 是否多选；
 * @typeParam T - 选项类型；
 */
export default function Dropdown<M extends boolean = false, T extends AvailableEnumType = string>(
    props: Props<M, T>
): JSX.Element {
    props = mergeProps(presetProps, props);

    const [_, menuProps] = splitProps(props, ['trigger', 'children', 'items', 'ref', 'onChange', 'class', 'style', 'align']);
    const [triggerRef, setTriggerRef] = createSignal<HTMLDivElement>();
    let menuRef: MenuRef;
    let rootRef: HTMLDivElement;
    let isOpen = false;
    const isManual = (props.trigger === 'contextmenu') || (props.trigger === 'custom');

    const show = (): void => {
        if (isOpen) { return; }

        menuRef.root().showPopover();
        const anchor = triggerRef()!.getBoundingClientRect();
        adjustPopoverPosition(menuRef.root(), anchor, 0, 'bottom', props.align);
    };

    const hide = (): void => {
        if (!isOpen) { return; }
        menuRef.root().hidePopover();
    };

    const toggle = (): void => { return isOpen ? hide() : show(); };

    // popover === manual 模式下，需要手动处理按钮
    if (isManual) {
        const handleEsc = (e: KeyboardEvent) => {
            if (e.key === 'Escape') { hide(); }
        };

        onMount(() => { document.addEventListener('keydown', handleEsc); });
        onCleanup(() => { document.removeEventListener('keydown', handleEsc); });
    }

    // 右键菜单为手动模式，需要处理鼠标点击在菜单之外的情况。
    // 但是 custom 模式下，不需要处理鼠标点击在菜单之外的情况，
    // 否则将 show 绑定在菜单之外的按钮，会导致菜单始终无法打开。
    if (props.trigger === 'contextmenu') {
        const click = (e: MouseEvent) => {
            if (!menuRef.root().contains(e.target as HTMLElement)) {
                hide();
            }
        };

        onMount(() => { document.addEventListener('click', click); });
        onCleanup(() => { document.removeEventListener('click', click); });
    }

    if (props.hotkey) {
        onMount(() => {
            Hotkey.bind(props.hotkey!, toggle);
        });
        onCleanup(() => { Hotkey.unbind(props.hotkey!); });
    }

    return <div class={joinClass(props.palette, props.class)} style={props.style} ref={el => rootRef = el}>
        <div aria-haspopup ref={el => setTriggerRef(el)} onmouseenter={() => {
            if (props.trigger !== 'hover' || !menuRef) { return; }
            show();
        }} onmouseleave={e => {
            if (props.trigger !== 'hover' || !menuRef) { return; }

            if (!pointInElement(e.clientX, e.clientY, menuRef.root())) { hide(); }
        }} oncontextmenu={e => {
            if (props.trigger !== 'contextmenu' || !menuRef) { return; }

            e.preventDefault();
            show();
            adjustPopoverPosition(menuRef.root(), new DOMRect(e.clientX, e.clientY, 1, 1));
        }} onclick={e => {
            if (props.trigger !== 'click' || !menuRef) { return; }

            e.preventDefault();
            e.stopPropagation();
            show();
        }}>{props.children}</div>

        <Menu layout='vertical' tag='menu' {...menuProps} items={props.items}
            class={joinClass(undefined, styles.dropdown)} ref={el => {
                el.root().tabIndex = -1;
                el.root().popover = isManual ? 'manual' : 'auto';
                menuRef = el;

                el.root().onmouseleave = e => {
                    if (props.trigger !== 'hover') { return; }
                    if (!pointInElement(e.clientX, e.clientY, triggerRef()!)) {
                        hide();
                    }
                };

                el.root().onbeforetoggle = (e: ToggleEvent) => {
                    isOpen = e.newState === 'open';
                    if (props.onPopover && props.onPopover(isOpen)) {
                        isOpen = false;
                        e.preventDefault();
                    }
                };

                if (props.ref) {
                    props.ref({
                        show: show,
                        hide: hide,
                        toggle: toggle,
                        root: () => rootRef,
                        menu: () => el,
                    });
                }
            }}
            onChange={(val, old) => {
                if (props.onChange) { props.onChange(val, old); }
                if (!props.multiple) { hide(); }
            }}
        />
    </div>;
}
