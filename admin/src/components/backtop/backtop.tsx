// SPDX-FileCopyrightText: 2024 caixw
//
// SPDX-License-Identifier: MIT

import { JSX, mergeProps, onCleanup, onMount } from 'solid-js';

import { BaseProps } from '@/components/base';
import { Button, ButtonRef } from '@/components/button';

export interface Props extends BaseProps {
    /**
     * 用于滚动的容器
     *
     * 只有该容器的带有滚动条，组件才会有效果，比如通过 overflow-y: visible 和 height: xx 对容器进行限制。
     */
    scroller: HTMLElement;
    
    /**
     * 当容器顶部不可见区域达到此值时才会显示按钮，默认为 10。
     */
    distance?: number;
    
    class?: string;
    classList?: JSX.CustomAttributes<HTMLElement>['classList'];
    style?: JSX.HTMLAttributes<HTMLElement>['style'];
}

const presetProps: Partial<Props> = {
    distance: 10,
} as const;

/**
 * 返回顶部的按钮
 */
export default function(props: Props): JSX.Element {
    props = mergeProps(presetProps, props);
    
    let btn: ButtonRef;
    const scroll = () => {
        btn.style.visibility = props.scroller.scrollTop > props.distance! ? 'visible' : 'hidden';
    };
    
    onMount(() => {
        scroll(); // 初始化状态
        props.scroller.addEventListener('scroll', scroll);
    });
    
    onCleanup(() => { props.scroller.removeEventListener('scroll', scroll); });
    
    // 计算 class
    if ('classList' in props) {
        props['classList'] = { ...props['classList'], 'c--backtop':true};
    } else {
        props['classList'] = { 'c--backtop': true };
    }
    
    return <Button icon rounded palette={props.palette} ref={el => btn = el}
        class={props.class} classList={props.classList} style={props.style}
        onclick={() => {
            props.scroller.scrollTo({ top: 0, behavior: 'smooth' });
        }}>vertical_align_top</Button>;
}