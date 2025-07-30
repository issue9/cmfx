// SPDX-FileCopyrightText: 2025 caixw
//
// SPDX-License-Identifier: MIT

import { adjustPopoverPosition, PopoverPosition } from '@cmfx/core';
import { JSX, ParentProps } from 'solid-js';

import { BaseProps } from '@/base';
import { use } from '@/context';
import styles from './style.module.css';

export interface Ref {
    /**
     * 显示提示框
     * @param anchor 用于定位提示框的元素；
     * @param pos 相对 anchor 的位置；
     */
    show(anchor: HTMLElement, pos: PopoverPosition): void;

    /**
     * 隐藏提示内容
     */
    hide(): void;
}

export interface Props extends BaseProps, ParentProps {
    /**
     * 停留时间
     *
     * NOTE: 非响应属性
     */
    stays?: number;

    ref: { (ref: Ref): void; }
}

/**
 * 小型的弹出提示框
 */
export default function Tooltip(props: Props): JSX.Element {
    let ref: HTMLDivElement;
    const [, , opt] = use();
    const duration = props.stays ?? opt.stays;

    props.ref({
        show(anchor: HTMLElement, pos: PopoverPosition) {
            ref.showPopover();
            const anchorRect = calcPos(pos, ref.getBoundingClientRect(), anchor.getBoundingClientRect());
            adjustPopoverPosition(ref, anchorRect, 4, pos);

            if (duration >= 0) { setTimeout(() => ref.hidePopover(), duration); }
        },

        hide() { ref.hidePopover(); }
    });

    return <div popover='auto' class={styles.tooltip} ref={el => ref = el}>{props.children}</div>;
}

function calcPos(pos: PopoverPosition, poprect: DOMRect, anchor: DOMRect): DOMRect {
    switch (pos) {
    case 'left':
    case 'right':
        const y =  anchor.y - (poprect.height - anchor.height) / 2;
        return new DOMRect(anchor.x, y, anchor.width, anchor.height);
    case 'top':
    case 'bottom':
        const x =  anchor.x - (poprect.width - anchor.width) / 2;
        return new DOMRect(x, anchor.y, anchor.width, anchor.height);
    }
}
