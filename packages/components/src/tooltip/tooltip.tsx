// SPDX-FileCopyrightText: 2025 caixw
//
// SPDX-License-Identifier: MIT

import { pop, PopPos } from '@cmfx/core';
import { JSX, ParentProps } from 'solid-js';

import { BaseProps } from '@/base';
import styles from './style.module.css';

export interface Ref {
    /**
     * 显示提示框
     * @param anchor 用于定位提示框的元素；
     * @param pos 相对 anchor 的位置；
     * @param timeout 自动关闭的时间，如果为空，采用默认值 1000，如果为负数表示不主动关闭；
     */
    show(anchor: HTMLElement, pos: PopPos, timeout?: number): void;

    /**
     * 隐藏提示内容
     */
    hide(): void;
}

export interface Props extends BaseProps, ParentProps {
    ref: { (ref: Ref): void; }
}

/**
 * 小型的弹出提示框
 */
export default function Tooltip(props: Props): JSX.Element {
    let ref: HTMLDivElement;

    props.ref({
        show(anchor: HTMLElement, pos: PopPos, timeout?: number) {
            ref.showPopover();
            const anchorRect = calcPos(pos, ref.getBoundingClientRect(), anchor.getBoundingClientRect());

            pop(ref, anchorRect, 4, pos);
            if (!timeout) {
                timeout = 1000;
            }

            if (timeout >= 0) {
                setTimeout(() => ref.hidePopover(), timeout);
            }
        },

        hide() {
            ref.hidePopover();
        }
    });

    return <div popover='auto' class={styles.tooltip} ref={el => ref = el}>{props.children}</div>;
}

function calcPos(pos: PopPos, poprect: DOMRect, anchor: DOMRect): DOMRect {
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
