// SPDX-FileCopyrightText: 2024-2026 caixw
//
// SPDX-License-Identifier: MIT

import type { JSX } from 'solid-js';

/**
 * 处理事件
 *
 * solidjs 可以处理像 `onClick={[handler, item.id]}` 这种非标准的事件类型，
 * 此方法用于将非标准模式下的方法转换为标准的事件行为。
 *
 * NOTE: 并不是所有的事件都是 {@link JSX#EventHandlerUnion} 类型的，
 * 但是都大同小异，其它的类型可根据此方法自行处理。
 */
export function handleEvent<T, E extends Event>(
	h: JSX.EventHandlerUnion<T, E>,
	e: Parameters<JSX.EventHandler<T, E>>[0],
) {
	if (typeof h === 'function') {
		h(e);
	} else {
		h[0](h[1], e);
	}
}
