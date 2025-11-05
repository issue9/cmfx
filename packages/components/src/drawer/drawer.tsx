// SPDX-FileCopyrightText: 2024-2025 caixw
//
// SPDX-License-Identifier: MIT

import { createSignal, JSX, mergeProps, onCleanup, onMount, splitProps } from 'solid-js';
import IconMenu from '~icons/material-symbols/menu';
import IconMenuOpen from '~icons/material-symbols/menu-open';

import { BaseProps, Breakpoint, classList, joinClass, Palette, RefProps } from '@/base';
import { ToggleButton, ToggleButtonProps } from '@/button';
import { Transition } from '@/transition';
import styles from './style.module.css';

export interface Ref {
    /**
     * 返回组件的根元素
     */
    element(): HTMLDivElement;

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
     *
     * @reactive
     */
    floating?: boolean | Breakpoint;

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

    mainPalette?: Palette;
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

    return <div ref={el => rootRef = el} class={classList(props.palette, {
        'cmfx-drawer-floating': props.floating === true,
        '@max-xs/root:cmfx-drawer-floating': props.floating === 'xs',
        '@max-sm/root:cmfx-drawer-floating': props.floating === 'sm',
        '@max-md/root:cmfx-drawer-floating': props.floating === 'md',
        '@max-lg/root:cmfx-drawer-floating': props.floating === 'lg',
        '@max-xl/root:cmfx-drawer-floating': props.floating === 'xl',
        '@max-2xl/root:cmfx-drawer-floating': props.floating === '2xl',
    }, props.pos === 'end' ? styles.end : '', styles.drawer, props.class)}
    >
        <aside ref={(el) => asideRef = el} classList={{
            'cmfx-drawer-hidden-aside': props.floating !== undefined && !visible(),
        }}
        >{props.children}</aside>
        <main class={joinClass(props.mainPalette)} ref={el => {
            if (props.ref) {
                props.ref({
                    element() { return rootRef; },
                    main() { return el; },
                    aside() { return asideRef; },
                    show() { setVisible(true); },
                    hide() { setVisible(false); },
                    toggle() { setVisible(!visible()); },
                    ToggleButton(p?: ToggleDrawerButtonProps): JSX.Element {
                        p = mergeProps({ on: <IconMenuOpen />, off: <IconMenu />, value: visible() }, p);
                        const [_, btnProps] = splitProps(p, ['class']);
                        return <ToggleButton {...btnProps as ToggleButtonProps} class={classList(p.palette, {
                            '@xs/root:hidden!': props.floating == 'xs',
                            '@sm/root:hidden!': props.floating == 'sm',
                            '@md/root:hidden!': props.floating == 'md',
                            '@lg/root:hidden!': props.floating == 'lg',
                            '@xl/root:hidden!': props.floating == 'xl',
                            '@2xl/root:hidden!': props.floating == '2xl',
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
