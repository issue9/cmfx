// SPDX-FileCopyrightText: 2024 caixw
//
// SPDX-License-Identifier: MIT

/**
 * 计算弹出对象的位置
 *
 * 默认是与锚定对象的左边对齐，但如果整个弹出对象超出了屏幕的右边，则改用锚定对象的右侧对齐。
 *
 * @param pop 弹出对象，必须得是可见状态的；
 * @param anchor 锚定对象的范围；
 * @param padding pop 与 anchor 两者之间的间隙，CSS 的 margin-top 或 margin-bottom 值；
 */
export function calcPopoverPos(pop: HTMLElement, anchor: DOMRect, padding?: string) {
    // TODO: [CSS anchor](https://caniuse.com/?search=anchor) 支持全面的话，可以用 CSS 代替。

    pop.style.top = anchor.bottom + 'px';
    pop.style.left = anchor.left + 'px';
    const pr = pop.getBoundingClientRect(); // 需要先设置 top 和 left，才能得到正确的 Rect。

    if (pr.right > window.innerWidth) {
        pop.style.left = (anchor.right - pr.width) + 'px';
    }

    if (pr.bottom > window.innerHeight) {
        pop.style.top = (anchor.top - pr.height) + 'px';
        pop.style.marginBottom = padding ?? '';
    } else {
        pop.style.marginTop = padding ?? '';
    }
}