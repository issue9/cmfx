// SPDX-FileCopyrightText: 2024-2025 caixw
//
// SPDX-License-Identifier: MIT

import { createEffect, createSignal, JSX, Match, mergeProps, onCleanup, onMount, Switch } from 'solid-js';
import { Transition } from 'solid-transition-group';

import { BaseProps, Breakpoint, classList } from '@/base';
import styles from './style.module.css';

export interface Props extends BaseProps {
    /**
     * 是否显示侧边栏的内容
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

    const [floating, setFloating] = createSignal(false);
    const [floatCls, setFloatCls] = createSignal('');

    createEffect(() => {
        setFloating(props.floating !== false);
        if (typeof props.floating === 'string') {
            setFloatCls(props.floating);
        }
    });

    if (props.close) {
        const handleClick = (e: MouseEvent) => {
            if (!floating() || !props.visible) { return; }

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

    const Aside = ()=><aside ref={(el)=>asideRef=el} class={classList({
        'cmfx-drawer__aside-hidden': !props.visible,
        'cmfx-drawer__aside-right': floating() && props.pos === 'right',
    }, props.palette ? `palette--${props.palette}` : undefined)}>{props.children}</aside>;

    return <div ref={(el) => mainRef = el} class={classList({
        'cmfx--drawer-floating': !floatCls() && floating(),
        'max-xs:cmfx--drawer-floating': floatCls() == 'xs',
        'max-sm:cmfx--drawer-floating': floatCls() == 'sm',
        'max-md:cmfx--drawer-floating': floatCls() == 'md',
        'max-lg:cmfx--drawer-floating': floatCls() == 'lg',
        'max-xl:cmfx--drawer-floating': floatCls() == 'xl',
        'max-2xl:cmfx--drawer-floating': floatCls() == '2xl',
    }, styles.drawer)}>
        <Switch>
            <Match when={props.pos === 'left'}>
                <Aside />
                <main>
                    <Transition mode='outin'
                        exitActiveClass={styles['drawer-fade-exit-active']}
                        enterClass={styles['drawer-fade-enter']}
                        exitToClass={styles['drawer-fade-exit-to']}
                        enterActiveClass={styles['drawer-fade-enter-active']}>{props.main}</Transition>
                </main>
            </Match>
            <Match when={props.pos === 'right'}>
                <main><Transition mode='outin' 
                    exitActiveClass={styles['drawer-fade-exit-active']}
                    enterClass={styles['drawer-fade-enter']}
                    exitToClass={styles['drawer-fade-exit-to']}
                    enterActiveClass={styles['drawer-fade-enter-active']}>{props.main}</Transition></main>
                <Aside />
            </Match>
        </Switch>
    </div>;
}
