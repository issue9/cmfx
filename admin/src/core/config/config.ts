// SPDX-FileCopyrightText: 2024-2025 caixw
//
// SPDX-License-Identifier: MIT

/**
 * 提供保存于浏览器端的配置接口
 */
export class Config {
    readonly #id: string;
    readonly #s: Storage;

    /**
     * 构造函数
     *
     * @param id 表示此配置对象的唯一 ID；
     * @param s 存储位置，默认为 {window#localStorage}；
     */
    constructor(id: string | number, s?: Storage) {
        this.#id = ((typeof id === 'number') ? id.toString() : id) + '--';

        if (!s) {
            s = localStorage;
        }
        this.#s = s;
    }

    get<T>(id: string): T | undefined {
        const s = this.#s.getItem(this.#id + id);
        if (!s) {
            return;
        }
        return JSON.parse(s);
    }

    set<T>(id: string, obj: T) {
        const s = JSON.stringify(obj);
        this.#s.setItem(this.#id + id, s);
    }

    remove(id: string) { this.#s.removeItem(this.#id + id); }
}