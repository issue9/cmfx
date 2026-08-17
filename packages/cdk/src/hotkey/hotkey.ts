// SPDX-FileCopyrightText: 2024-2026 caixw
//
// SPDX-License-Identifier: MIT

import { LogicError } from '@cmfx/core';
import Browser from 'bowser';

export const modifiers = ['meta', 'alt', 'control', 'shift'] as const;

/**
 * 支持的修饰符
 */
export type Modifier = (typeof modifiers)[number];

/**
 * 至少一个修饰符
 */
export type Modifiers = [Modifier, ...Modifier[]];

export const modifierCodes: ReadonlyMap<Modifier, number> = new Map<Modifier, number>([
	['meta', 1], // window / command
	['alt', 2], // alt / option
	['control', 4], // ctrl / control
	['shift', 8],
]);

const osName = Browser.parse(window.navigator.userAgent).os.name?.toLowerCase();

const modifierSymbols: ReadonlyMap<string, ReadonlyMap<Modifier, string>> = new Map([
	[
		'windows',
		new Map([
			['meta', 'Win'],
			['alt', 'Alt'],
			['control', 'Ctrl'],
			['shift', 'Shift'],
		]),
	],
	[
		'macos',
		new Map([
			['meta', '⌘'],
			['alt', '⌥'],
			['control', '⌃'],
			['shift', '⇧'],
		]),
	],
]);

const modifierSymbolsByOS = osName ? modifierSymbols.get(osName) : undefined;

/**
 * 定义快捷键
 */
export class Hotkey {
	readonly key: string;
	readonly #keyCode: string;
	readonly modifiers: number;
	readonly #keys: Array<string>;

	constructor(key: string, ...modifiers: Modifiers) {
		modifiers = modifiers.sort();
		for (let i = 0; i < modifiers.length; i++) {
			if (modifiers[i] === modifiers[i + 1]) {
				throw new LogicError(`重复的修饰符 ${modifiers[i]}`);
			}
		}

		let code = 0;
		for (const m of modifiers) {
			code += modifierCodes.get(m)!;
		}
		this.key = key;
		this.#keyCode = `Key${key.toUpperCase()}`;
		this.modifiers = code;
		this.#keys = this.#buildKeys();
	}

	/**
	 * 获取当前快捷键的按键字符串
	 */
	#buildKeys(): string[] {
		const keys: string[] = [];
		for (const [k, v] of modifierCodes) {
			if ((this.modifiers & v) === v) {
				keys.push(k);
			}
		}
		keys.push(this.key);

		return keys;
	}

	/**
	 * 判断 e 是否与当前实例相等
	 */
	equal(e: Hotkey): boolean {
		return e.#keyCode === this.#keyCode && e.modifiers === this.modifiers;
	}

	/**
	 * 判断事件 e 的按键是否与当前匹配
	 */
	match(e: KeyboardEvent): boolean {
		if (e.code !== this.#keyCode) {
			return false;
		}

		let count = 0;
		if (e.metaKey) {
			count += 1;
		}
		if (e.altKey) {
			count += 2;
		}
		if (e.ctrlKey) {
			count += 4;
		}
		if (e.shiftKey) {
			count += 8;
		}
		return count === this.modifiers;
	}

	/**
	 * 获取当前快捷键的按键字符串
	 */
	keys(): string[] {
		return this.#keys;
	}

	/**
	 * 将快捷键转换为一个可读的字符串
	 *
	 * @param os - 是否输出与当前系统相符的快捷键符号；
	 */
	toString(os?: boolean): string {
		if (os && modifierSymbolsByOS) {
			return this.#keys.map(k => modifierSymbolsByOS.get(k as Modifier) ?? k).join('+');
		}
		return this.#keys.join('+');
	}
}
