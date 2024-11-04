// SPDX-FileCopyrightText: 2024 caixw
//
// SPDX-License-Identifier: MIT

import { JSX, mergeProps, onCleanup, onMount } from 'solid-js';

import { BaseProps } from '@/components/base';
import { Button, ButtonRef } from '@/components/button';
import { IconSymbol } from '@/components/icon';

export interface Props extends BaseProps {
    /**
     * 用于滚动的容器
     *
     * 如果该值为字符串，则会被当作元素 ID 进行查找。
     *
     * NOTE: 只有该容器的带有滚动条，组件才会有效果，比如通过 overflow-y: visible 和 height: xx 对容器进行限制。
     *
     * NOTE: 如果该值最终结果为空，将不会创建整个 BackTop 组件。
     *
     * NOTE: 这是一个非响应式的属性。
     */
    scroller: HTMLElement | string;
    
    /**
     * 当容器顶部不可见区域达到此值时才会显示按钮，默认为 10。
     */
    distance?: number;
    
    children?: IconSymbol;
    
    class?: string;
    classList?: JSX.CustomAttributes<HTMLElement>['classList'];
    style?: JSX.HTMLAttributes<HTMLElement>['style'];
}

const presetProps: Partial<Props> = {
    distance: 10,
    children: 'vertical_align_top'
} as const;

/**
 * 返回顶部的按钮
 */
export default function(props: Props): JSX.Element {
    props = mergeProps(presetProps, props);

    const scroller = typeof props.scroller === 'string' ? document.getElementById(props.scroller) : props.scroller;
    if (!scroller) {
        console.warn('指定的滚动容器不存在，将不会创建 BackTop 组件。');
        return <></>;
    }

    let btn: ButtonRef;
    const scroll = () => {
        btn.style.visibility = scroller.scrollTop > props.distance! ? 'visible' : 'hidden';
    };
    
    onMount(() => {
        scroll(); // 初始化状态
        scroller.addEventListener('scroll', scroll);
    });

    onCleanup(() => { scroller.removeEventListener('scroll', scroll); });

    return <Button icon rounded palette={props.palette} ref={el => btn = el}
        class={props.class} style={props.style} classList={{
            'c--backtop': true,
            ...props.classList
        }} onclick={() => {
            scroller.scrollTo({ top: 0, behavior: 'smooth' });
        }}>{ props.children }</Button>;
}