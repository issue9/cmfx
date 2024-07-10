// SPDX-FileCopyrightText: 2024 caixw
//
// SPDX-License-Identifier: MIT

import { A } from '@solidjs/router';
import { createSignal, JSX, Match, Show, Switch } from 'solid-js';

export interface Props {
    /**
     * 是否展开子元素
     */
    expand?: boolean;

    /**
     * 跳转的地址，如果此值不为空，一般转换为 a.href 属性。
     */
    to?: string;

    /**
     * 点击触发的事件
     *
     * 仅在 to 属性未指定的情况下，此属性才会有效。
     */
    onClick?: { (): void };

    /**
     * 是否禁用当前项
     */
    disabled?: boolean;

    /**
     * 头部的图标
     */
    head?: string;

    /**
     * 列表项的文本内容
     */
    text?: JSX.Element;

    /**
     * 子菜单，必须是 Item 类型。
    */
    children?: JSX.Element;
};

export default function Item (props: Props) {
    const [hidden, setHidden] = createSignal(!props.expand);

    const content = <>
        <div class="title" onClick={() => { setHidden(!hidden()); }}>
            <Show when={props.head}>
                <span class="material-symbols-outlined">{props.head}</span>
            </Show>

            {props.text}

            <Show when={props.children}>
                <span class="material-symbols-outlined tail">{hidden()? 'keyboard_arrow_down':'keyboard_arrow_up'}</span>
            </Show>
        </div>

        <Show when={props.children}>
            <div class={`list ${hidden() ? 'hidden' : ''}`} role="menu">
                {props.children}
            </div>
        </Show>
    </>;

    return <Switch fallback={<div role="menuitem" class="item">{content}</div>}>
        <Match when={!props.to && props.onClick}>
            <div role="menuitem" class="item" onClick={props.onClick}>{content}</div>
        </Match>

        <Match when={props.to}>
            <A href={props.to!} role="menuitem" class="item" activeClass="active">{content}</A>
        </Match>
    </Switch   >;

}
