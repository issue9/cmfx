// SPDX-FileCopyrightText: 2024-2026 caixw
//
// SPDX-License-Identifier: MIT

import { createEffect, createSignal, JSX, mergeProps, onCleanup, onMount, splitProps } from 'solid-js';
import IconMenu from '~icons/material-symbols/menu';
import IconMenuOpen from '~icons/material-symbols/menu-open';

import { BaseProps, classList, joinClass, RefProps } from '@/base';
import { ToggleButton, ToggleButtonProps } from '@/button';
import { Transition } from '@/transition';
import styles from './style.module.css';

export interface Ref {
    /**
     * 返回组件的根元素
     */
    root(): HTMLDivElement;

    /**
     * 返回侧边栏的元素
     */
    aside(): HTMLElement;

    /**
     * 返回组件主区域的元素
     */
    main(): HTMLElement;

    /**
     * 显示侧边栏
     */
    show(): void;

    /**
     * 隐藏侧边栏
     */
    hide(): void;

    /**
     * 切换侧边栏的状态
     */
    toggle(): void;

    /**
     * 生成一个用于显示和隐藏侧边栏的按钮组件
     *
     * @param props - 组件属性，参数说明如下：
     *  - on 显示状态下的图标；
     *  - off 隐藏状态下的图标；
     *
     * @remarks 该按钮会根据侧边栏的状态是否处于可调整的状态而自动显示或是隐藏。
     */
    ToggleButton(props?: ToggleDrawerButtonProps): JSX.Element;
}

type ToggleDrawerButtonProps = Omit<ToggleButtonProps, 'toggle' | 'value' | 'on' | 'off'> & {
    on?: JSX.Element;
    off?: JSX.Element;
};

export interface Props extends BaseProps, RefProps<Ref> {
    /**
     * 侧边栏的初始状态
     */
    visible?: boolean;

    /**
     * 侧边栏是以浮动的形式出现
     *
     * @remarks 默认值为 false。如果是 true 或是 false 表示始终保持一种状态，
     * 其它的值表示在整个页面小于此值时才变为浮动状态。
     * 除 boolean 以外的取值与窗口查询的值相对应，比如 2xl 对应的是 `@2xl`。
     *
     * @reactive
     */
    floating?: boolean | '3xs' | 'xs' | 'sm' | 'md' | 'lg' | '2xl' | '4xl' | '6xl' | '8xl';

    /**
     * 位置，默认值为 start
     *
     * @reactive
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

    mainClass?: string;
}

const presetProps: Readonly<Partial<Props>> = {
    pos: 'start',
    floating: false
};

export function Drawer(props: Props) {
    props = mergeProps(presetProps, props);
    let rootRef: HTMLDivElement;
    let asideRef: HTMLElement;

    const [visible, setVisible] = createSignal(props.visible);

    onMount(() => {
        const handleClick = (e: MouseEvent) => {
            if ((props.floating === undefined) || !visible()) { return; }

            const node = e.target as HTMLElement;
            if (rootRef.contains(node) && !asideRef.contains(node)) {
                setVisible(false);
            }
        };

        document.addEventListener('click', handleClick);
        onCleanup(() => {
            document.removeEventListener('click', handleClick);
        });
    });

    // 处理按钮的显示状态
    const [hidden, setHidden] = createSignal(false);
    onMount(() => {
        const ob = new ResizeObserver(() => {
            setHidden(getComputedStyle(asideRef).getPropertyValue('position') !== 'absolute');
        });
        ob.observe(asideRef);
        onCleanup(() => ob.disconnect());
    });
    createEffect(() => {
        const f = props.floating;
        if (f) {
            setHidden(getComputedStyle(asideRef).getPropertyValue('position') !== 'absolute');
        }
    });

    return <div class={joinClass(props.palette, props.pos === 'end' ? styles.end : '', styles.drawer, props.class)}
        style={props.style} ref={el => rootRef = el}
    >
        <aside ref={el => asideRef = el} classList={{
            'cmfx-drawer-floating-aside': props.floating === true,
            '@max-3xs/drawer:cmfx-drawer-floating-aside': props.floating === '3xs',
            '@max-xs/drawer:cmfx-drawer-floating-aside': props.floating === 'xs',
            '@max-sm/drawer:cmfx-drawer-floating-aside': props.floating === 'sm',
            '@max-md/drawer:cmfx-drawer-floating-aside': props.floating === 'md',
            '@max-lg/drawer:cmfx-drawer-floating-aside': props.floating === 'lg',
            '@max-2xl/drawer:cmfx-drawer-floating-aside': props.floating === '2xl',
            '@max-4xl/drawer:cmfx-drawer-floating-aside': props.floating === '4xl',
            '@max-6xl/drawer:cmfx-drawer-floating-aside': props.floating === '6xl',
            '@max-8xl/drawer:cmfx-drawer-floating-aside': props.floating === '8xl',

            'cmfx-drawer-hidden-aside': props.floating === true && !visible(),
            '@max-3xs/drawer:cmfx-drawer-hidden-aside': props.floating === '3xs' && !visible(),
            '@max-xs/drawer:cmfx-drawer-hidden-aside': props.floating === 'xs' && !visible(),
            '@max-sm/drawer:cmfx-drawer-hidden-aside': props.floating === 'sm' && !visible(),
            '@max-md/drawer:cmfx-drawer-hidden-aside': props.floating === 'md' && !visible(),
            '@max-lg/drawer:cmfx-drawer-hidden-aside': props.floating === 'lg' && !visible(),
            '@max-2xl/drawer:cmfx-drawer-hidden-aside': props.floating === '2xl' && !visible(),
            '@max-4xl/drawer:cmfx-drawer-hidden-aside': props.floating === '4xl' && !visible(),
            '@max-6xl/drawer:cmfx-drawer-hidden-aside': props.floating === '6xl' && !visible(),
            '@max-8xl/drawer:cmfx-drawer-hidden-aside': props.floating === '8xl' && !visible(),
        }}
        >{props.children}</aside>
        <main class={props.mainClass} ref={el => {
            if (props.ref) {
                props.ref({
                    root() { return rootRef; },
                    main() { return el; },
                    aside() { return asideRef; },
                    show() { setVisible(true); },
                    hide() { setVisible(false); },
                    toggle() { setVisible(!visible()); },
                    ToggleButton(p?: ToggleDrawerButtonProps): JSX.Element {
                        p = mergeProps({ on: <IconMenuOpen />, off: <IconMenu />, value: visible() }, p);
                        const [_, btnProps] = splitProps(p, ['class']);
                        return <ToggleButton {...btnProps as ToggleButtonProps} class={classList(p.palette, {
                            'hidden!': hidden(),
                        }, props.class)} toggle={async (): Promise<boolean> => {
                            setVisible(!visible());
                            return !!visible();
                        }}
                        />;
                    }
                });
            }
        }}>
            <Transition>{props.main}</Transition>
        </main>
    </div>;
}
