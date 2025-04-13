// SPDX-FileCopyrightText: 2024-2025 caixw
//
// SPDX-License-Identifier: MIT

import { createEffect, createSignal, JSX, Match, mergeProps, onCleanup, onMount, Switch } from 'solid-js';
import { Transition } from 'solid-transition-group';

import { BaseProps } from '@/components/base';
import { Breakpoint } from '@/core';

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

    /**
     * 包含主元素区的元素 ID
     */
    mainID?: string;
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

    const Aside = ()=><aside ref={(el)=>asideRef=el} classList={{
        [`palette--${props.palette}`]: !!props.palette,
        'aside-hidden': !props.visible,
        'pos-right': floating() && props.pos === 'right',
    }}>{props.children}</aside>;

    return <div ref={(el)=>mainRef=el} classList={{
        'c--drawer': true,
        'c--drawer-floating': !floatCls() && floating(),
        'max-xs:c--drawer-floating': floatCls() == 'xs',
        'max-sm:c--drawer-floating': floatCls() == 'sm',
        'max-md:c--drawer-floating': floatCls() == 'md',
        'max-lg:c--drawer-floating': floatCls() == 'lg',
        'max-xl:c--drawer-floating': floatCls() == 'xl',
        'max-2xl:c--drawer-floating': floatCls() == '2xl',
    }}>
        <Switch>
            <Match when={props.pos === 'left'}>
                <Aside />
                <main id={props.mainID}><Transition mode='outin' name='drawer-fade'>{props.main}</Transition></main>
            </Match>
            <Match when={props.pos === 'right'}>
                <main id={props.mainID}><Transition mode='outin' name='drawer-fade'>{props.main}</Transition></main>
                <Aside />
            </Match>
        </Switch>
    </div>;
}
