// SPDX-FileCopyrightText: 2024 caixw
//
// SPDX-License-Identifier: MIT

import { JSX, Setter, mergeProps, onCleanup, onMount, splitProps } from 'solid-js';
import { Dynamic } from 'solid-js/web';

import { BaseProps, Corner } from '@/components/base';

export interface Props extends BaseProps {
    [k: string]: unknown;

    /**
     * 控制弹出内容的可见性
     */
    visible?: boolean;

    /**
     * 控制可见性
     *
     * 如果指定了该值，那么在点击非当前控件时将关闭弹出的窗口，
     * 否则将只能通过控制 visible 属性关闭窗口。
     */
    setVisible?: Setter<boolean>;

    /**
     * 触发元素
     */
    activator: JSX.Element;

    /**
     * 弹出内容的位置，相对于 activator。默认值为 bottomleft
     */
    pos?: Corner;

    /**
     * 弹出的内容
     */
    children: JSX.Element;

    /**
     * 弹出内容的标签
     */
    tag?: string;

    /**
     * 用于指整个容器的样式
     */
    wrapperClass?: string;
}

const defaultProps: Readonly<Partial<Props>> = {
    tag: 'div',
    pos: 'bottomleft'
};

export default function Dropdown(props: Props) {
    props = mergeProps(defaultProps, props);
    const [_, contentProps] = splitProps(props, ['visible', 'setVisible', 'activator', 'pos', 'children', 'tag', 'wrapperClass']);

    let ref: HTMLDivElement;
    const handleClick = (e: MouseEvent) => {
        // NOTE: solidjs 的 onClick 事件注册在 dom，事件处理是自顶向下的，与正常的处理相反。
        // on:click 与正常的相同，但是无法通过 ts 编译：https://github.com/solidjs/solid/discussions/1441

        if (props.setVisible && !ref.contains(e.target as Node) && props.visible) {
            props.setVisible(false);
        }
    };
    onMount(() => {
        document.body.addEventListener('click', handleClick);
    });
    onCleanup(() => {
        document.body.removeEventListener('click', handleClick);
    });

    return <div ref={(el)=>ref=el} class={props.wrapperClass} classList={{
        'c--dropdown': true,
        [`palette--${props.palette}`]: !!props.palette
    }}>
        {props.activator}

        <Dynamic {...contentProps} component={props.tag} classList={{
            'content': true,
            [`${props.pos}`]: true,
            'visible': props.visible
        }}>
            {props.children}
        </Dynamic>
    </div>;
}
