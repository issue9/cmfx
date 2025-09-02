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
    let ref: HTMLDivElement;
    const [, , opt] = useComponents();
    const duration = props.stays ?? opt.stays;

    props.ref({
        show(anchor: HTMLElement, pos: PopoverPosition) {
            ref.showPopover();
            adjustPopoverPosition(ref, anchor.getBoundingClientRect(), 4, pos, 'center');

            if (duration >= 0) { setTimeout(() => ref.hidePopover(), duration); }
        },

        hide() { ref.hidePopover(); }
    });

    return <div popover='auto' class={joinClass(styles.tooltip, props.class)}
        ref={el => ref = el}
    >{props.children}</div>;
}
