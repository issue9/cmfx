// SPDX-FileCopyrightText: 2025 caixw
//
// SPDX-License-Identifier: MIT

/**
 * 表示组件的属性字段错误
 */
export class PropsError extends Error {
    readonly #prop: string;
    readonly #msg: any;

    /**
     * 初始化表示组件属性错误的对象
     *
     * @param prop - 组件属性名称；
     * @param msg - 错误信息；
     */
    constructor(prop: string, msg: any) {
        super(msg);
        this.name = 'PropsError';

        this.#msg = msg;
        this.#prop = prop;
    }

    /**
     * 获取错误的属性名称
     */
    get prop(): string { return this.#prop; }

    /**
     * 获取错误信息
     */
    get message(): any { return this.#msg; }
}
