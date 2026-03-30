// SPDX-FileCopyrightText: 2025-2026 caixw
//
// SPDX-License-Identifier: MIT

/**
 * 无法找到上下文环境，一般在 useContext 系列方法的调用中抛出。
 */
export class ContextNotFoundError extends Error {
	#name: string;

	constructor(name: string, msg?: string) {
		super(msg);
		this.#name = name;
	}

	get name(): string {
		return this.#name;
	}
}
