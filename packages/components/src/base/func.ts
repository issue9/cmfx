// SPDX-FileCopyrightText: 2024-2025 caixw
//
// SPDX-License-Identifier: MIT

import { JSX } from 'solid-js';

/**
 * 复制整个 {@link JSX#Element} 元素
 *
 * NOTE: 仅复制元素，对于响应方式可能并不会有效果。
 */
export function cloneElement(e: JSX.Element): JSX.Element {
    if (e instanceof Node) {
        return e.cloneNode(true);
    } else if (Array.isArray(e)) {
        return e.map(e => cloneElement(e));
    } else { // 其它的均为普通类型，直接返回。
        return e;
    }
}

/**
 * 处理事件
 *
 * solidjs 可以处理像 `onClick={[handler, item.id]}` 这种非标准的事件类型，
 * 此方法用于将非标准模式下的方法转换为标准的事件行为。
 *
 * NOTE: 并不是所有的事件都是 {@link JSX#EventHandlerUnion} 类型的，
 * 但是都大同小异，其它的类型可根据此方法自行处理。
 */
export function handleEvent<T, E extends Event>(h: JSX.EventHandlerUnion<T, E>, e: Parameters<JSX.EventHandler<T,E>>[0]) {
    if (typeof h === 'function') {
        h(e);
    } else {
        h[0](h[1], e);
    }
}

/**
 * 将 solidjs 中的 classList 内容转换为 class 属性
 *
 * @param list - 组件的 classList 对象；
 * @param cls - CSS 类名列表；
 * @returns 转换而来的 class 属性值；
 */
export function classList(
    list?: JSX.CustomAttributes<HTMLElement>['classList'], ...cls: Array<string|undefined>
): string | undefined {
    if (!list) { return joinClass(...cls); }

    const entries = Object.entries(list);
    if (entries.length === 0) { return joinClass(...cls); }

    const items = entries.map(item => item[1] ? item[0] : undefined);
    items.push(...cls);

    return joinClass(...items);
}

/**
 * 将多个 CSS 的类名组合成 class 属性值
 */
export function joinClass(...cls: Array<string|undefined|null>): string | undefined {
    if (!cls) { return; }
    cls = cls.filter(v => v !== undefined && v !== '');
    return cls.length > 0 ? cls.join(' ') : undefined;
}
