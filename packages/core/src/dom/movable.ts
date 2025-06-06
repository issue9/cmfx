// SPDX-FileCopyrightText: 2025 caixw
//
// SPDX-License-Identifier: MIT

export interface Cancel {
    (): void;
}

/**
 * 使一个容器成为一个可拖拽移动的对象
 *
 * @param toolbar 鼠标控制区域；
 * @param container 被移动的窗口，需要保证 toolbar 参数包含在 container 之内，且要 container 处于在可见状态；
 * @returns 销毁所有注册的事件；
 */
export function movable(toolbar: HTMLElement, container: HTMLElement): Cancel {
    let moving = false;
    let x = 0, y = 0;
    const w = container.offsetWidth;

    const mouseDown = (e: MouseEvent) => {
        moving = true;
        x = e.clientX - container.offsetLeft;
        y = e.clientY - container.offsetTop;
    };

    const mouseMove = (e: MouseEvent) => {
        if (!moving) return;
        container.style.left = `${e.clientX - x}px`;
        container.style.top = `${e.clientY - y}px`;
        container.style.width = `${w}px`;
    };

    const mouseFree = () => { moving = false; };

    toolbar.addEventListener('mousedown', mouseDown);
    toolbar.addEventListener('mousemove', mouseMove);
    toolbar.addEventListener('mouseup', mouseFree);
    toolbar.addEventListener('mouseout', mouseFree);
    toolbar.style.cursor = 'move';

    return () => {
        toolbar.removeEventListener('mousedown', mouseDown);
        toolbar.removeEventListener('mousemove', mouseMove);
        toolbar.removeEventListener('mouseup', mouseFree);
        toolbar.removeEventListener('mouseout', mouseFree);
        toolbar.style.cursor = 'pointer';
    };
}
