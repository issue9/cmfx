// SPDX-FileCopyrightText: 2024 caixw
//
// SPDX-License-Identifier: MIT

import { JSX, Match, mergeProps, onCleanup, onMount, Switch } from 'solid-js';

import { BaseProps } from '@/components/base';

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
     */
    floating?: boolean;

    /**
     * 位置，默认值为 left
     */
    pos?: 'left' | 'right';

    /**
     * 侧边栏的内容
     */
    children: JSX.Element;

    main: JSX.Element;
}

const defaultProps: Readonly<Partial<Props>> = {
    pos: 'left'
};

export default function(props: Props) {
    props = mergeProps(defaultProps, props);
    let asideRef: Node;

    if (props.close) {
        const handleClick = (e: MouseEvent) => {
            if (!props.floating || !props.visible) { return; }

            const node = e.target as Node;
            if (!asideRef.contains(node)) {
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
        'hidden': !props.visible,
        'right-0': props.floating && props.pos === 'right'
    }}>
        {props.children}
    </aside>;

    return <div classList={{
        'c--drawer': true,
        'c--drawer-floating': props.floating
    }}>
        <Switch>
            <Match when={props.pos === 'left'}>
                <Aside />
                <main>{props.main}</main>
            </Match>
            <Match when={props.pos === 'right'}>
                <main>{props.main}</main>
                <Aside />
            </Match>
        </Switch>
    </div>;
}
