// SPDX-FileCopyrightText: 2025 caixw
//
// SPDX-License-Identifier: MIT

import { JSX } from 'solid-js';

import { BaseProps, Palette } from '@/base';
import { Step as BaseStep, Ref } from '@/wizard/step';

export interface Step extends BaseStep {
    // TODO
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

    ref?: { (el: Ref): void; };
}

/**
 * 显示教程的组件
 */
export default function Tour(props: Props): JSX.Element {
    // TODO
}