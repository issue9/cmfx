// SPDX-FileCopyrightText: 2026 caixw
//
// SPDX-License-Identifier: MIT

import { NetworkError } from '@core/errors';
import type { Problem } from './rest';

/**
 * 表示与后端交互过程中的错误信息
 */
export class APIError extends NetworkError {
	/**
	 * 将 {@link Problem} 转换为 {@link APIError} 对象
	 */
	static fromProblem<E>(p: Problem<E>): APIError {
		return new APIError(p.status, p?.title, p.headers, p?.detail);
	}

	readonly #status: number;
	readonly #title?: string;
	readonly #headers?: Headers;

	/**
	 * 构造函数
	 *
	 * @param status - 状态码；
	 * @param title - 简要的错误说明；
	 * @param headers - HTTP 响应头；
	 * @param message - 详细的错误说明；
	 */
	constructor(status: number, title?: string, headers?: Headers, message?: string) {
		super(message);

		this.#status = status;
		this.#title = title;
		this.#headers = headers;
		this.name = 'APIError';
	}

	/**
	 * 表示 HTTP 状态码
	 *
	 * @remarks
	 * 如果该值为 0，表示发生在请求生效之前，比如网络出问题，或是浏览器本身的问题等。
	 */
	get status(): number {
		return this.#status;
	}

	/**
	 * 表示简要的错误说明
	 */
	get title(): string | undefined {
		return this.#title;
	}

	/**
	 * 报头
	 */
	get headers(): Headers | undefined {
		return this.#headers;
	}
}
