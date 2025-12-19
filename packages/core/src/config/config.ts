// SPDX-FileCopyrightText: 2024-2025 caixw
//
// SPDX-License-Identifier: MIT

/**
 * 提供了可按用户分别保存配置的方法
 */
export class Config {
    readonly #prefix: string;
    readonly #storage: Storage;
    #curr: string; // 当前用户的唯一标记
    #idPrefix: string = ''; // 当前用户的所有配置项 ID 前缀

    /**
     * 构造函数
     *
     * @param prefix - 配置项的命名前缀，用于区分不同模块的配置；
     * @param uid - 表示此配置对象的唯一 ID，一般为用户的 ID；
     * @param s - 存储位置，默认为 {@link window#localStorage}；
     */
    constructor(prefix: string, uid: string, s?: Storage) {
        this.#prefix = prefix;
        this.#storage = s || localStorage;
        this.#curr = uid;
        this.switch(uid);
    }

    get prefix(): string { return this.#prefix; }

    get storage(): Storage { return this.#storage; }

    /**
     * 获取当前配置项的 ID
     */
    get current(): string { return this.#curr; }

    /**
     * 切换用户
     *
     * @param uid - 新用户的 ID
     */
    switch (uid: string): void {
        this.#curr = uid;
        this.#idPrefix = `${this.prefix}--${uid}--`;
    }

    /**
     * 获取配置项
     */
    get<T>(id: string): T | undefined {
        const s = this.#storage.getItem(this.#idPrefix + id);
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
        this.#storage.setItem(this.#idPrefix + id, s);
    }

    /**
     * 删除配置项
     */
    remove(id: string) { this.#storage.removeItem(this.#idPrefix + id); }

    /**
     * 清空当前用户的所有配置项
     */
    clear() {
        for (let i = 0; i < this.storage.length; i++) {
            const key = this.storage.key(i);
            if (key && key.startsWith(this.#idPrefix)) {
                this.storage.removeItem(key);
            }
        }
    }
}
