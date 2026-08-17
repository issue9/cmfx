// SPDX-FileCopyrightText: 2024-2026 caixw
//
// SPDX-License-Identifier: MIT

import { LogicError } from '@cmfx/core';

import { Hotkey, type Modifiers } from './hotkey';

/**
 * 快捷键的处理方法
 */
export type Handler = (e: KeyboardEvent) => void;

export type EventType = 'keyup' | 'keydown';

export interface HotkeyContext {
	/**
	 * 是否存在指定的快捷键
	 */
	hasKeys(key: string, ...modifiers: Modifiers): boolean;

	/**
	 * 是否存在指定的快捷键
	 */
	has(hotkey: Hotkey): boolean;

	/**
	 * 绑定快捷键
	 *
	 * @param handler - 处理函数；
	 * @param key - 快捷键；
	 * @param modifiers - 修饰符；
	 */
	bindKeys(handler: Handler, key: string, ...modifiers: Modifiers): void;

	/**
	 * 绑定快捷键
	 *
	 * @param hotkey - 快捷键；
	 * @param handler - 快捷键处理函数；
	 */
	bind(hotkey: Hotkey, handler: Handler): void;

	/**
	 * 解绑快捷键
	 *
	 * @param hotkey - 快捷键；
	 */
	unbind(hotkey: Hotkey): void;
}

/**
 * 快捷键管理
 */
export class Manager implements HotkeyContext {
	#handlers: Map<Hotkey, Handler> = new Map();
	#root: Node | null;
	#eventType: EventType;

	#onkeyup = (e: KeyboardEvent): void => {
		for (const [hk, h] of this.#handlers) {
			if (hk.match(e)) {
				h(e);
				e.stopPropagation();
				e.preventDefault();
			}
		}
	};

	/**
	 * 初始化环境
	 */
	constructor(root: Node, event: EventType = 'keyup') {
		if (!root) {
			throw new LogicError('root 不能为空');
		}

		this.#root = root;
		this.#eventType = event;
		this.#root.addEventListener(this.#eventType, this.#onkeyup as EventListener);
	}

	/**
	 * 注销环境
	 */
	destroy(): void {
		if (!this.#root) {
			return;
		}

		this.#root.removeEventListener(this.#eventType, this.#onkeyup as EventListener);
		this.#handlers.clear();
		this.#root = null;
	}

	hasKeys(key: string, ...modifiers: Modifiers): boolean {
		return this.has(new Hotkey(key, ...modifiers));
	}

	has(hotkey: Hotkey): boolean {
		for (const [hk] of this.#handlers) {
			if (hk.equal(hotkey)) {
				return true;
			}
		}
		return false;
	}

	bindKeys(handler: Handler, key: string, ...modifiers: Modifiers): void {
		this.bind(new Hotkey(key, ...modifiers), handler);
	}

	bind(hotkey: Hotkey, handler: Handler): void {
		for (const [hk] of this.#handlers) {
			if (hk.equal(hotkey)) {
				throw new LogicError(`快捷键 ${hotkey.toString()} 已经存在`);
			}
		}

		this.#handlers.set(hotkey, handler);
	}

	unbind(hotkey: Hotkey): void {
		for (const [hk] of this.#handlers) {
			if (hk.equal(hotkey)) {
				this.#handlers.delete(hk);
				break;
			}
		}
	}
}
