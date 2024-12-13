// SPDX-FileCopyrightText: 2024 caixw
//
// SPDX-License-Identifier: MIT

import { JSX, ParentProps, Show } from 'solid-js';

import { IconSymbol, Label, Page } from '@/components';

export default function(props: ParentProps): JSX.Element {
    return <Page title='_i.page.current.dashboard' class="p--dashboard">
        {props.children}
    </Page>;
}

export interface PanelProps extends ParentProps {
    class?: string;

    /**
     * 面板的图标
     *
     * NOTE: 如果 {@link PanelProps#icon} 和 {@link PanelProps#title} 均为空，则不显示标题栏。
     */
    icon?: IconSymbol;

    /**
     * 面板的标题
     *
     * NOTE: 如果 {@link PanelProps#icon} 和 {@link PanelProps#title} 均为空，则不显示标题栏。
     */
    title?: string;
}

/**
 * 仪表盘页面中的仪表盘
 */
export function Panel(props: PanelProps): JSX.Element {
    return <div class={'panel ' + (props.class ? props.class : '')} >
        <Show when={props.icon || props.title}>
            <Label icon={props.icon}>{ props.title }</Label>
        </Show>
        {props.children}
    </div>;
}
