// SPDX-FileCopyrightText: 2024-2025 caixw
//
// SPDX-License-Identifier: MIT

import { getScrollableParent } from '@cmfx/core';
import { JSX, mergeProps, onCleanup, onMount, ParentProps } from 'solid-js';
import IconVerticalAlignTop from '~icons/material-symbols/vertical-align-top';

import { BaseProps, joinClass, RefProps } from '@/base';
import { Button, ButtonRef } from '@/button';
import styles from './style.module.css';

export interface Ref {
    element(): ButtonRef;

    /**
     * 返回页面顶部
     *
     * @remarks 该功能与直接点击按钮具有相同的效果。
     */
    backtop(): void;
}

export interface Props extends BaseProps, ParentProps, RefProps<Ref> {
    /**
     * 当容器顶部不可见区域达到此值时才会显示按钮，默认为 10。
     *
     * @defaultValue 10
     */
    distance?: number;
}

/**
 * 返回顶部的按钮
 *
 * 该组件会向上查找包含 overflow-y、overflow-block 或是 overflow 样式的组件，如果能找到，将功能用在此组件上。
 */
export function BackTop(props: Props): JSX.Element {
    props = mergeProps({ distance: 10 }, props);

    let ref: ButtonRef;
    let scroller: HTMLElement | undefined;

    const calcVisible = () => { // 计算按钮的可见性
        ref.element().style.visibility = scroller!.scrollTop > props.distance! ? 'visible' : 'hidden';
    };

    const backtop = () => {
        scroller && scroller.scrollTo({ top: 0, behavior: 'smooth' });
    };

    onMount(() => {
        scroller = getScrollableParent('y', ref.element());
        if (!scroller) { return; }

        calcVisible(); // 初始化状态
        scroller!.addEventListener('scroll', calcVisible);
    });

    onCleanup(() => {
        scroller && scroller.removeEventListener('scroll', calcVisible);
    });

    return <Button square rounded palette={props.palette} ref={el => {
        ref = el;

        if (props.ref) {
            props.ref({
                element() { return ref; },
                backtop() { backtop(); }
            });
        }
    }} class={joinClass(undefined, styles.backtop, props.class)} onclick={() => backtop()}
    >
        {props.children ?? <IconVerticalAlignTop />}
    </Button>;
}
