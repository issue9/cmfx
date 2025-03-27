/*
 * SPDX-FileCopyrightText: 2025 caixw
 *
 * SPDX-License-Identifier: MIT
 */

import { JSX } from 'solid-js';

import { BaseProps, Palette } from '@/components/base';

export interface Step {
    /**
     * 指向的组件 ID
     *
     * 如果为空，则是以对话框的形式弹出在页面中间。
     */
    id?: string; 

    /**
     * 弹出框的详细内容
     */
    content: string;

    /**
     * 标题
     */
    title?: string;
}

export interface Props extends BaseProps {
    /**
     * 指定所有教程步骤
     */
    steps: Array<Step>;

    /**
     * 突出元素的色盘
     */
    accentPalette?: Palette;

    /**
     * 第一个页面的开始按钮
     */
    start?: JSX.Element;

    /**
     * 最后一页的结束按钮
     */
    complete?: JSX.Element;

    /**
     * 上一页的按钮
     */
    prev?: JSX.Element;

    /**
     * 下一页的按钮
     */
    next?: JSX.Element;
}

export default function Tour(props: Props): JSX.Element {
    // TODO
}