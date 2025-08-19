// SPDX-FileCopyrightText: 2024-2025 caixw
//
// SPDX-License-Identifier: MIT

const popParentPos: Array<string> = ['relative', 'absolute', 'fixed', 'sticky'] as const;

/**
 * 调整弹出 popover 元素的位置
 *
 * @param popRef - 弹出对象，必须得是可见状态且有一个明确的 display 属性；
 * @param anchor - 锚定对象的范围；
 * @param padding - popRef 与 anchor 两者之间的间隙；
 * @param pos - 相对于 anchor 的弹出位置；
 *
 * NOTE: 该操作会在 popRef 显示期间调整其父元素的 position 属性。
 */
export function adjustPopoverPosition(popRef: HTMLElement, anchor: DOMRect, padding?: number, pos: PopoverPosition = 'bottom') {
    // TODO: [CSS anchor](https://caniuse.com/?search=anchor) 支持全面的话，可以用 CSS 代替。

    const parent = popRef.parentElement;
    if (parent) {
        const parentPos = parent.style.position;
        if (!popParentPos.includes(parentPos ?? '')) {
            parent.style.setProperty('position', 'relative');
            popRef.style.setProperty('position', 'absolute'); // 只有 absolute 才会超出窗口大小时出现滚动条。

            const toggle = (e: ToggleEvent) => {
                if (e.newState !== 'open') {
                    parent.style.setProperty('position', parentPos);
                    popRef.removeEventListener('toggle', toggle);
                }
            };
            popRef.addEventListener('toggle', toggle);
        }
    }

    const p = calcPopoverPosition(popRef, anchor, pos, padding);
    popRef.style.top = p.y + 'px';
    popRef.style.left = p.x + 'px';
}

/**
 * 计算弹出对象的位置
 *
 * @param popRef - 弹出对象，必须得是可见状态的；
 * @param anchor - 锚定对象的范围；
 * @param pos - popRef 相对 anchor 的位置；
 * @param padding - popRef 与 anchor 两者之间的间隙；
 */
export function calcPopoverPosition(popRef: HTMLElement, anchor: DOMRect, pos: PopoverPosition, padding?: number): Point {
    const popRect = popRef.getBoundingClientRect(); // 需要先设置 top 和 left，才能得到正确的 Rect。
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

/**
 * 判断点是否在元素内
 */
export function pointInElement(x: number, y:number, elem: HTMLElement): boolean {
    const rect = elem.getBoundingClientRect();
    return x >= rect.left && x <= rect.right && y >= rect.top && y <= rect.bottom;
}

interface Point {
    x: number;
    y: number;
}

export type PopoverPosition = 'top' | 'bottom' | 'left' | 'right';
