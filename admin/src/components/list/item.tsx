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

    return <Switch>
        <Match when={!props.to}>
            <div role="menuitem" class="item">
                {content}
            </div>
        </Match>

        <Match when={props.to}>
            <A href={props.to!} role="menuitem" class="item" activeClass="active">
                {content}
            </A>
        </Match>
    </Switch  >;

}
