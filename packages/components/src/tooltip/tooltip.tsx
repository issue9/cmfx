// SPDX-FileCopyrightText: 2025 caixw
//
// SPDX-License-Identifier: MIT

import { adjustPopoverPosition, PopoverPosition } from '@cmfx/core';
import { JSX, ParentProps } from 'solid-js';

import { BaseProps, joinClass } from '@/base';
import { useComponents } from '@/context';
import styles from './style.module.css';

export interface Ref {
    /**
     * 显示提示框
     * @param anchor - 用于定位提示框的元素；
     * @param pos - 相对 anchor 的位置；
     */
    show(anchor: HTMLElement, pos: PopoverPosition): void;

    /**
     * 隐藏提示内容
     */
    hide(): void;

    element(): HTMLDivElement;
}

/**
 * Tooltip 组件的属性
 */
export interface Props extends BaseProps, ParentProps {
    /**
     * 停留时间
     *
     * @defaultValue 采用 {@link ../context#Options.stays}
     * @reactive
     */
    stays?: number;

    ref: { (ref: Ref): void; }
}

/**
 * 小型的弹出提示框
 */
export default function Tooltip(props: Props): JSX.Element {
    const [, opt] = useComponents();
    const duration = props.stays ?? opt.stays!;

    return <div popover='auto' class={joinClass(props.palette, styles.tooltip, props.class)}
        style={props.style} ref={el => {
            props.ref({
                show(anchor: HTMLElement, pos: PopoverPosition) {
                    el.showPopover();
                    adjustPopoverPosition(el, anchor.getBoundingClientRect(), 4, pos, 'center');

                    if (duration >= 0) { setTimeout(() => el.hidePopover(), duration); }
                },

                hide() { el.hidePopover(); },

                element() { return el; }
            });
        }}
    >{props.children}</div>;
}
