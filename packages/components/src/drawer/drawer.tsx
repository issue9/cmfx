// SPDX-FileCopyrightText: 2024-2025 caixw
//
// SPDX-License-Identifier: MIT

import { createEffect, createSignal, JSX, mergeProps, onCleanup, onMount } from 'solid-js';
import { Transition } from 'solid-transition-group';

import { BaseProps, Breakpoint, classList } from '@/base';
import styles from './style.module.css';

export interface Props extends BaseProps {
    /**
     * 是否显示侧边栏的内容
     *
     * NOTE: 仅在 floating !== false 时有效果，
     * 当 floating === false 时，表示侧边栏始终是可见的。
     */
    visible?: boolean;

    /**
     * 当 floating 为 true 时，点击遮罩层将调用此方法关闭侧边栏。
     *
     * NOTE: 这不是响应式的属性。
     */
    close?: { (): void };

    /**
     * 侧边栏是以浮动的形式出现，默认值为 false。
     *
     * 如果是 true 或是 false 表示始终保持一种状态，
     * 其它的值表示在整个页面小于此值时才变为浮动状态。
     */
    floating?: boolean | Breakpoint;

    /**
     * 位置，默认值为 left
     */
    pos?: 'left' | 'right';

    /**
     * 侧边栏的内容
     */
    children: JSX.Element;

    /**
     * 主元素区的内容
     */
    main: JSX.Element;
}

const presetProps: Readonly<Partial<Props>> = {
    pos: 'left',
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
            document.body.addEventListener('click', handleClick);
        });
        onCleanup(() => {
            document.body.removeEventListener('click', handleClick);
        });
    }

    const Aside = () => <aside ref={(el) => asideRef = el} class={classList({
        ['cmfx-drawer-hidden-aside']: !props.visible && canFloating(),
    }, props.palette ? `palette--${props.palette}` : undefined)}>{props.children}</aside>;

    const Main = () => <main>
        <Transition mode='outin'
            exitActiveClass={styles['drawer-fade-exit-active']}
            enterClass={styles['drawer-fade-enter']}
            exitToClass={styles['drawer-fade-exit-to']}
            enterActiveClass={styles['drawer-fade-enter-active']}>{props.main}</Transition>
    </main>;

    // NOTE: 如果不放在 classList 中，tailwind 无法解析对应的值。
    return <div ref={(el) => mainRef = el} class={classList({
        'cmfx-drawer-floating': !floatCls() && canFloating(),
        'max-xs:cmfx-drawer-floating': floatCls() == 'xs',
        'max-sm:cmfx-drawer-floating': floatCls() == 'sm',
        'max-md:cmfx-drawer-floating': floatCls() == 'md',
        'max-lg:cmfx-drawer-floating': floatCls() == 'lg',
        'max-xl:cmfx-drawer-floating': floatCls() == 'xl',
        'max-2xl:cmfx-drawer-floating': floatCls() == '2xl',
    }, styles.drawer, props.pos === 'right' ? styles.right : undefined)}>
        <Aside />
        <Main />
    </div>;
}
