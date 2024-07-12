// SPDX-FileCopyrightText: 2024 caixw
//
// SPDX-License-Identifier: MIT

import { JSX } from 'solid-js';
import { template } from 'solid-js/web';

/**
 * 复制整个 JSX.Element 元素。
 */
export function cloneElement(e: JSX.Element): JSX.Element {
    if (e instanceof Element) {
        return template(e!.outerHTML, true)();
    }else if (e instanceof Node) {
        return e.cloneNode(true);
    } else if (Array.isArray(e)) {
        const a: Array<JSX.Element> = [];
        e.forEach((e) => { a.push(cloneElement(e)); });
        return a;
    } else { // 其它的均为普通类型，直接返回。
        return e;
    }
}
