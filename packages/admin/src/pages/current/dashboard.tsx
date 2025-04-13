// SPDX-FileCopyrightText: 2024 caixw
//
// SPDX-License-Identifier: MIT

import { JSX, ParentProps } from 'solid-js';

import { IconSymbol, Page } from '@/components';

export function Dashboard(props: ParentProps): JSX.Element {
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
