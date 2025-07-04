// SPDX-FileCopyrightText: 2024-2025 caixw
//
// SPDX-License-Identifier: MIT

import { getScrollableParent } from '@cmfx/core';
import { JSX, mergeProps, onCleanup, onMount } from 'solid-js';
import IconVerticalAlignTop from '~icons/material-symbols/vertical-align-top';

import { BaseProps, joinClass } from '@/base';
import { Button, ButtonRef } from '@/button';
import { IconComponent } from '@/icon';
import styles from './style.module.css';

export interface Props extends BaseProps {
    /**
     * 当容器顶部不可见区域达到此值时才会显示按钮，默认为 10。
     */
    distance?: number;

    children?: IconComponent;

    class?: string;
    style?: JSX.HTMLAttributes<HTMLElement>['style'];
}

const presetProps: Partial<Props> = {
    distance: 10,
    children: IconVerticalAlignTop
} as const;

/**
 * 返回顶部的按钮
 *
 * 该组件会向上查找包含 overflow-y、overflow-block 或是 overflow 样式的组件，如果能找到，将功能用在此组件上。
 */
export function BackTop(props: Props): JSX.Element {
    props = mergeProps(presetProps, props);
    let btn: ButtonRef;
    let scroller: HTMLElement | undefined;

    const scroll = () => {
        btn.style.visibility = scroller!.scrollTop > props.distance! ? 'visible' : 'hidden';
    };

    onMount(() => {
        setTimeout(() => {
            scroller = getScrollableParent('y', btn);
            if (!scroller) { return; }

            scroll(); // 初始化状态
            scroller!.addEventListener('scroll', scroll);
        }, 500); // 500 用于等待 CSS 样式生效
    });

    onCleanup(() => {
        scroller && scroller.removeEventListener('scroll', scroll);
    });

    return <Button square rounded palette={props.palette} ref={el => btn = el}
        class={joinClass(styles.backtop, props.class)} style={props.style}
        onclick={() => {
            scroller && scroller.scrollTo({ top: 0, behavior: 'smooth' });
        }}>{props.children!({})}</Button>;
}
