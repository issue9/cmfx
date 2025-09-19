// SPDX-FileCopyrightText: 2024-2025 caixw
//
// SPDX-License-Identifier: MIT

const popParentPos: Array<string> = ['relative', 'absolute', 'fixed', 'sticky'] as const;

interface Point {
    x: number;
    y: number;
}

export type PopoverPosition = 'top' | 'bottom' | 'left' | 'right';

export type PopoverAlign = 'start' | 'center' | 'end';

/**
 * 调整弹出元素 popRef 的位置
 *
 * @param popRef - 弹出对象，必须得是可见状态且有一个明确的 display 属性，必须得是一个具有 popover 属性的元素；
 * @param anchor - 锚定对象的范围；
 * @param padding - popRef 与 anchor 两者之间的间隙；
 * @param pos - 相对于 anchor 的弹出位置；
 * @param align - popRef 与 anchor 两者之间的对齐方式；
 *
 * @remarks 该操作会在 popRef 显示期间调整其父元素的 position 属性。
 */
export function adjustPopoverPosition(
    popRef: HTMLElement, anchor: DOMRect, padding?: number,
    pos: PopoverPosition = 'bottom', align: PopoverAlign = 'start'
) {
    // TODO: [CSS anchor](https://caniuse.com/?search=anchor) 支持全面的话，可以用 CSS 代替。

    const parent = popRef.parentElement;
    if (parent) {
        const parentPos = parent.style.position;
        if (!popParentPos.includes(parentPos)) {
            parent.style.setProperty('position', 'relative');

            const pos = popRef.style.position;
            popRef.style.setProperty('position', 'absolute'); // 只有 absolute 才会超出窗口大小时出现滚动条。

            const toggle = (e: ToggleEvent) => {
                if (e.newState !== 'open') { // 关闭时恢复原有样式
                    parent.style.setProperty('position', parentPos);
                    popRef.style.setProperty('position', pos);

                    popRef.removeEventListener('beforetoggle', toggle);
                }
            };
            popRef.addEventListener('beforetoggle', toggle);
        }
    }

    const rtl = window.getComputedStyle(popRef).direction === 'rtl';
    const p = calcPopoverPosition(popRef, anchor, pos, align, padding, rtl);
    popRef.style.top = p.y + 'px';
    popRef.style.bottom = 'unset';
    popRef.style.left = p.x + 'px';
    popRef.style.right = 'unset';
}

/**
 * 计算弹出对象的位置
 *
 * @param popRef - 弹出对象，必须得是可见状态的；
 * @param anchor - 锚定对象的范围；
 * @param pos - popRef 相对 anchor 的位置；
 * @param align - popRef 相对 anchor 的对齐方式；
 * @param padding - popRef 与 anchor 两者之间的间隙；
 * @param rtl - 是否是右到左的布局；
 *
 * @remarks 不考虑越界问题，只考虑位置和对齐方式。
 */
export function calcPopoverPosition(
    popRef: HTMLElement, anchor: DOMRect, pos: PopoverPosition, align: PopoverAlign, padding?: number, rtl = false
): Point {
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
        switch (align) {
        case 'start':
            p.y = anchor.top;
            break;
        case 'center':
            p.y = anchor.top + (anchor.height - popRect.height) / 2;
            break;
        case 'end':
            p.y = anchor.bottom - anchor.height;
            break;
        }
    } else if (pos === 'bottom' || pos === 'top') {
        if (rtl) {
            switch (align) {
            case 'start':
                p.x = anchor.right - popRect.width;
                break;
            case 'center':
                p.x = anchor.left + (anchor.width - popRect.width) / 2;
                break;
            case 'end':
                p.x = anchor.left;
                break;
            }
        } else {
            switch (align) {
            case 'start':
                p.x = anchor.left;
                break;
            case 'center':
                p.x = anchor.left + (anchor.width - popRect.width) / 2;
                break;
            case 'end':
                p.x = anchor.right - popRect.width;
                break;
            }
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
