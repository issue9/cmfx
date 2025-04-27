// SPDX-FileCopyrightText: 2024-2025 caixw
//
// SPDX-License-Identifier: MIT

/**
 * 提供用户保存于浏览器端的配置接口
 */
export class Config {
    readonly #prefix: string;
    readonly #s: Storage;
    #id: string = '';

    /**
     * 构造函数
     *
     * @param prefix 配置项的命名前缀，用于区分不同模块的配置；
     * @param id 表示此配置对象的唯一 ID，一般为用户的 ID；
     * @param s 存储位置，默认为 {window#localStorage}；
     */
    constructor(prefix: string, id: string | number, s?: Storage) {
        this.#prefix = prefix;
        if (!s) { s = localStorage; }
        this.#s = s;
        this.switch(id);
    }

    get prefix(): string { return this.#prefix; }

    get storage(): Storage { return this.#s; }

    /**
     * 切换配置对象
     * 
     * @param id 新对象的 ID，一般为用户的 ID。
     */
    switch (id: string | number): void {
        this.#id = this.#prefix + '--' + ((typeof id === 'number') ? id.toString() : id) + '--';
    }

    /**
     * 获取配置项
     */
    get<T>(id: string): T | undefined {
        const s = this.#s.getItem(this.#id + id);
        if (!s) {
            return;
        }
        return JSON.parse(s);
    }

    /**
     * 设置配置项
     */
    set<T>(id: string, obj: T) {
        const s = JSON.stringify(obj);
        this.#s.setItem(this.#id + id, s);
    }

    /**
     * 删除配置项
     */
    remove(id: string) { this.#s.removeItem(this.#id + id); }
}