// SPDX-FileCopyrightText: 2024 caixw
//
// SPDX-License-Identifier: MIT

import type { Modifiers } from './hotkey';
import { Hotkey } from './hotkey';

/**
 * 快捷键管理
 */
export class Hotkeys {
    /**
     * 将快捷键绑定在 elem 元素
     *
     * @param elem 绑定的元素
     * @param handler 处理方法
     * @param key 快捷键
     * @param modifiers 快捷键的修饰符，至少一个
     * @returns 解绑的方法
     */
    static bindElement(elem: HTMLElement, handler:{():void;}, key: string, ...modifiers: Modifiers) {
        const hk = new Hotkey(key, ...modifiers);

        const h = (e: KeyboardEvent)=>{
            if (hk.match(e)) {
                handler();
                e.preventDefault();
            }
        };

        elem.addEventListener('keydown', h);
        return ()=>{elem.removeEventListener('keydown', h);};
    }

    readonly #handlers: Array<[keys: Hotkey, handler:{():void;}]>;
    readonly #unbind: {():void;};

    /**
     * 构造函数
     *
     * @param elem 所有快捷键都绑定在此元素
     */
    constructor(elem: HTMLElement) {
        this.#handlers = [];

        const h = (e: KeyboardEvent)=>{
            for(const item of this.#handlers) {
                if (item[0].match(e)) {
                    item[1]();
                    e.preventDefault();
                    break;
                }
            }
        };

        elem.addEventListener('keydown', h);
        this.#unbind = ()=>{elem.removeEventListener('keydown', h);};
    }

    /**
     * 绑定快捷键
     * @param handler 绑定的事件
     * @param key 绑定的快捷键
     * @param modifiers 快捷键的修饰符
     */
    bind(handler:{():void;}, key: string, ...modifiers: Modifiers) {
        this.#handlers.push([new Hotkey(key, ...modifiers), handler]);
    }

    destroy() {
        this.#unbind();
    }
}
