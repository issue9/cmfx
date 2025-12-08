// SPDX-FileCopyrightText: 2024-2025 caixw
//
// SPDX-License-Identifier: MIT

/**
 * 一个包含 HTTP 状态码的错误
 */
export class HTTPError extends Error {
    #status: number;
    #title: string;

    /**
     * 构造函数
     * @param status - 状态码；
     * @param title - 简要的错误说明；
     * @param message - 详细的错误说明；
     */
    constructor(status: number, title: string, message?: string) {
        super(message);
        this.#status = status;
        this.#title = title;
        this.name = 'HTTPError';
    }

    /**
     * 表示 HTTP 状态码
     */
    get status(): number { return this.#status; }

    /**
     * 表示简要的错误说明
     */
    get title(): string { return this.#title; }
}
