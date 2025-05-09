// SPDX-FileCopyrightText: 2025 caixw
//
// SPDX-License-Identifier: MIT

/**
 * 向上查找可滚动的容器
 *
 * @param direction 检测滚动条的方向；
 * @param el 从 el 开始向上查找；
 */
export function getScollableParent(direction?: 'x' | 'y' | 'any', el?: HTMLElement | null): HTMLElement | undefined {
    if (!el) { return; }

    switch (direction) {
    case undefined:
    case 'any':
        if (isScrollable(el, 'overflow', 'overflow-x', 'overflow-y', 'overflow-block', 'overflow-inline')) {
            return el;
        };
        break;
    case 'x':
        if (isScrollable(el, 'overflow', 'overflow-inline', 'overflow-x')) {
            return el;
        };
        break;
    case 'y':
        if (isScrollable(el, 'overflow', 'overflow-block', 'overflow-y')) {
            return el;
        };
        break;
    }

    return getScollableParent(direction, el.parentElement);
}

type Overflow = 'overflow' | 'overflow-x' | 'overflow-y' | 'overflow-block' | 'overflow-inline';

function isScrollable(el: HTMLElement, ...prop: Array<Overflow>): boolean {
    const style = window.getComputedStyle(el);

    for(const p of prop) {
        const overflow = style.getPropertyValue(p);
        if (overflow.indexOf('scroll') > -1 || overflow.indexOf('auto') > - 1) {
            return true;
        };
    }

    return false;
}
