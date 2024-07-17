// SPDX-FileCopyrightText: 2024 caixw
//
// SPDX-License-Identifier: MIT

import { JSX, Match, mergeProps, onCleanup, onMount, Switch } from 'solid-js';

import { BaseProps, ElementProp, renderElementProp } from '@/components/base';

export interface Props extends BaseProps {
    /**
     * 是否显示侧边栏的内容
     */
    visible?: boolean;

    /**
     * 当 floating 为 true 时，点击遮罩层将调用此方法关闭侧边栏。
     *
     * NOTE: 这不是动态属性，{@link module:solid-js.Accessor} 不启作用。
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
    aside: ElementProp;

    children: JSX.Element;
}

const defaultProps: Partial<Props> = {
    pos: 'left'
};

export default function(props: Props) {
    props = mergeProps(defaultProps, props);
    let conRef: HTMLDivElement;
    let asideRef: Node;

    if (props.close) {
        const handleClick = (e: MouseEvent) => {
            const node = e.target as Node;
            if (conRef.contains(node) && !asideRef.contains(node)) {
                props.close?.();
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
        [`scheme--${props.scheme}`]: !!props.scheme,
        'hidden': !props.visible,
        'right-0': props.floating && props.pos === 'right'
    }}>
        {renderElementProp(props.aside)}
    </aside>;

    return <div ref={(el)=>conRef=el} classList={{ 'drawer': true, 'floating': props.floating && props.visible }}>
        <Switch>
            <Match when={props.pos === 'left'}>
                <Aside />
                <main>{props.children}</main>
            </Match>
            <Match when={props.pos === 'right'}>
                <main>{props.children}</main>
                <Aside />
            </Match>
        </Switch>
    </div>;
}
