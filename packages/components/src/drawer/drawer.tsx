// SPDX-FileCopyrightText: 2024-2025 caixw
//
// SPDX-License-Identifier: MIT

import { createEffect, createSignal, JSX, mergeProps, onCleanup, onMount } from 'solid-js';
import { Transition, TransitionProps } from 'solid-transition-group';

import { BaseProps, Breakpoint, classList, joinClass, Palette } from '@/base';
import styles from './style.module.css';

const transition: TransitionProps = {
    // NOTE: mode === outin 时，在嵌套 Transition 时会出现子元素无法显示的问题。
    // inout 模式则切换动画看起来比较乱，所以采用默认值，表示两者同时进行。

    enterActiveClass: styles['drawer-fade-enter-active'],
    enterClass: styles['drawer-fade-enter'],
    enterToClass: styles['drawer-fade-enter-to'],

    exitActiveClass: styles['drawer-fade-exit-active'],
    exitClass: styles['drawer-fade-exit'],
    exitToClass: styles['drawer-fade-exit-to'],
};

export interface Props extends BaseProps {
    /**
     * 是否显示侧边栏的内容
     *
     * @remarks 仅在 floating !== false 时有效果，
     * 当 floating === false 时，表示侧边栏始终是可见的。
     *
     * @reactive
     */
    visible?: boolean;

    /**
     * 当 floating 为 true 时，点击遮罩层将调用此方法关闭侧边栏。
     */
    close?: { (): void };

    /**
     * 侧边栏是以浮动的形式出现
     *
     * @remarks 默认值为 false。如果是 true 或是 false 表示始终保持一种状态，
     * 其它的值表示在整个页面小于此值时才变为浮动状态。
     */
    floating?: boolean | Breakpoint;

    /**
     * 位置，默认值为 start
     */
    pos?: 'start' | 'end';

    /**
     * 侧边栏的内容
     */
    children: JSX.Element;

    /**
     * 主元素区的内容
     */
    main: JSX.Element;

    mainPalette?: Palette;
}

const presetProps: Readonly<Partial<Props>> = {
    pos: 'start',
    floating: false
};

export function Drawer(props: Props) {
    props = mergeProps(presetProps, props);
    let asideRef: HTMLElement;
    let mainRef: HTMLElement;

    const [canFloating, setCanFloating] = createSignal(false);
    const [floatCls, setFloatCls] = createSignal('');

    createEffect(() => {
        setCanFloating(props.floating !== false);

        if (typeof props.floating === 'string') {
            setFloatCls(props.floating);
        } else {
            setFloatCls('');
        }
    });

    if (props.close) {
        const handleClick = (e: MouseEvent) => {
            if (!canFloating() || !props.visible) { return; }

            const node = e.target as HTMLElement;
            if (mainRef.contains(node) && !asideRef.contains(node)) {
                props.close!();
            }
        };

        onMount(() => {
            document.addEventListener('click', handleClick);
        });
        onCleanup(() => {
            document.removeEventListener('click', handleClick);
        });
    }

    return <div ref={el => mainRef = el} class={classList(props.palette, {
        'cmfx-drawer-floating': !floatCls() && canFloating(),
        '@max-xs/root:cmfx-drawer-floating': floatCls() == 'xs',
        '@max-sm/root:cmfx-drawer-floating': floatCls() == 'sm',
        '@max-md/root:cmfx-drawer-floating': floatCls() == 'md',
        '@max-lg/root:cmfx-drawer-floating': floatCls() == 'lg',
        '@max-xl/root:cmfx-drawer-floating': floatCls() == 'xl',
        '@max-2xl/root:cmfx-drawer-floating': floatCls() == '2xl',
    }, props.pos === 'end' ? styles.end : '', styles.drawer, props.class)}
    >
        <aside ref={(el) => asideRef = el}
            class={!props.visible && canFloating() ? 'cmfx-drawer-hidden-aside' : undefined}
        >{props.children}</aside>
        <main class={joinClass(props.mainPalette)}>
            <Transition {...transition}>{props.main}</Transition>
        </main>
    </div>;
}
