// SPDX-FileCopyrightText: 2024 caixw
//
// SPDX-License-Identifier: MIT

/**
 * 提供保存于浏览器端的配置接口
 */
export class Config {
    readonly #id: string;

    /**
     * 构造函数
     * @param id 表示引配置对象的唯一 ID
     */
    constructor(id: string | number) {
        this.#id = ((typeof id === 'number') ? id.toString() : id) + '--';
    }

    get<T>(id: string): T | undefined {
        const s = localStorage.getItem(this.#id + id);
        if (!s) {
            return;
        }
        return JSON.parse(s);
    }

    set<T>(id: string, obj: T) {
        const s = JSON.stringify(obj);
        localStorage.setItem(this.#id + id, s);
    }

    remove(id: string) {
        localStorage.removeItem(id);
    }

    clear() {
        const keys = localStorage.keys();
        for(const key of keys) {
            if (key.startsWith(this.#id)) {
                localStorage.removeItem(key);
            }
        }
    }
}