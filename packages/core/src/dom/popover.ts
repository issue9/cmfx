// SPDX-FileCopyrightText: 2024-2025 caixw
//
// SPDX-License-Identifier: MIT

/**
 * 弹出 pop 元素
 *
 * @param pop 弹出对象，必须得是可见状态的；
 * @param anchor 锚定对象的范围；
 * @param padding pop 与 anchor 两者之间的间隙；
 * @param pos 相对于 anchor 的弹出位置；
 */
export function pop(pop: HTMLElement, anchor: DOMRect, padding?: number, pos: PopPos = 'bottom') {
    // TODO: [CSS anchor](https://caniuse.com/?search=anchor) 支持全面的话，可以用 CSS 代替。

    const p = calcPopoverPos(pop, anchor, pos, padding);
    pop.style.top = p.y + 'px';
    pop.style.left = p.x + 'px';
}

/**
 * 计算弹出对象的位置
 *
 * @param pop 弹出对象，必须得是可见状态的；
 * @param anchor 锚定对象的范围；
 * @param pos pop 相对 anchor 的位置；
 * @param padding pop 与 anchor 两者之间的间隙；
 */
export function calcPopoverPos(pop: HTMLElement, anchor: DOMRect, pos: PopPos, padding?: number): Point {
    const popRect = pop.getBoundingClientRect(); // 需要先设置 top 和 left，才能得到正确的 Rect。
    padding = padding ?? 0;

    const p: Point = { x: 0, y: 0 };

    switch (pos) {
    case 'left':
        p.x = anchor.left - popRect.width - padding;
        p.y = anchor.top;
        break;
    case 'right':
        p.x = anchor.right + padding;
        p.y = anchor.top;
        break;
    case 'top':
        p.x = anchor.left;
        p.y = anchor.top - popRect.height - padding;
        break;
    case 'bottom':
        p.x = anchor.left;
        p.y = anchor.bottom + padding;
        break;
    }

    // 计算交叉轴的位置
    if (pos === 'left' || pos === 'right') {
        const delta = p.y + popRect.height - window.innerHeight;
        if (delta > 0) {
            p.y -= delta;
        }

        if (p.y < 0) { p.y = 0; }
    } else {
        const delta = p.x + popRect.width - window.innerWidth;
        if (delta > 0) {
            p.x -= delta;
        }

        if (p.x < 0) { p.x = 0; }
    }

    return p;
}

interface Point {
    x: number;
    y: number;
}

export type PopPos = 'top' | 'bottom' | 'left' | 'right';
