// SPDX-FileCopyrightText: 2024-2025 caixw
//
// SPDX-License-Identifier: MIT

/**
 * 支持的修饰符
 */
export type Modifier = 'meta' | 'alt' | 'control' | 'shift';

export type Modifiers = [Modifier, ...Modifier[]];

export const modifierCodes: ReadonlyMap<Modifier, number> = new Map<Modifier,number>([
    ['meta', 1],
    ['alt', 2],
    ['control', 4],
    ['shift', 8],
]);

export type Handler = (e: KeyboardEvent) => void;

// 触发的事件名称
const eventName = 'keyup';

/**
 * 定义快捷键
 */
export class Hotkey {
    static #handlers: Map<Hotkey, Handler> = new Map();
    static #inited = false;

    static #onkeyup = (e: KeyboardEvent) => {
        for (const [hk, h] of Hotkey.#handlers) {
            if (hk.match(e)) {
                h(e);
            }
        }
    };

    /**
     * 初始化环境
     */
    static init(): void {
        if (Hotkey.#inited) {
            return;
        }

        document.addEventListener(eventName, Hotkey.#onkeyup);
        Hotkey.#inited = true;
    }

    /**
     * 注销环境
     */
    static destroy(): void {
        if (!Hotkey.#inited) {
            return;
        }

        document.removeEventListener(eventName, Hotkey.#onkeyup);
        Hotkey.#handlers.clear();
        Hotkey.#inited = false;
    }

    /**
     * 绑定快捷键
     *
     * @param handler 处理函数；
     * @param key 快捷键；
     * @param modifiers 修饰符；
     */
    static bindKeys(handler: Handler, key: string, ...modifiers: Modifiers): void {
        Hotkey.bind(new Hotkey(key, ...modifiers), handler);
    }

    /**
     * 绑定快捷键
     *
     * @param hotkey 快捷键；
     * @param handler 快捷键处理函数；
     */
    static bind(hotkey: Hotkey, handler: Handler): void {
        for (const [hk] of Hotkey.#handlers) {
            if (hk.equal(hotkey)) {
                throw new Error(`快捷键 ${hotkey.toString()} 已经存在`);
            }
        }

        Hotkey.#handlers.set(hotkey, handler);
    }

    /**
     * 解绑快捷键
     *
     * @param hotkey 快捷键；
     */
    static unbind(hotkey: Hotkey): void { Hotkey.#handlers.delete(hotkey); }

    /********************* 以下为实例方法 ***********************/

    readonly key: string;
    readonly modifiers: number;

    constructor(key: string, ...modifiers: Modifiers) {
        modifiers = modifiers.sort();
        for (let i = 0;i<modifiers.length; i++) {
            if (modifiers[i] === modifiers[i+1]) {
                throw `重复的修饰符 ${modifiers[i]}`;
            }
        }

        let code = 0;
        for(const m of modifiers) {
            code += modifierCodes.get(m)!;
        }
        this.key = key.toLocaleLowerCase();
        this.modifiers = code;
    }

    /**
     * 判断 e 是否与当前实例相等
     */
    equal(e: Hotkey): boolean { return e.key == this.key && e.modifiers == this.modifiers; }

    /**
     * 判断事件 e 的按键是否与当前匹配
     */
    match(e: KeyboardEvent): boolean {
        if (e.key.toLocaleLowerCase() !== this.key) { return false; }

        let count = 0;
        if (e.metaKey) {count +=1;}
        if (e.altKey) {count +=2;}
        if (e.ctrlKey) {count +=4;}
        if (e.shiftKey) {count +=8;}
        return count === this.modifiers;
    }

    /**
     * 获取当前快捷键的按键字符串
     */
    keys(): string[] {
        const keys: string[] = [];
        for (const [k, v] of modifierCodes) {
            if ((this.modifiers & v) === v) {
                keys.push(k);
            }
        }

        keys.push(this.key);

        return keys;
    }

    toString(): string { return this.keys().join('+'); }
}
