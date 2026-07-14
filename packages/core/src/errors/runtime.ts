// SPDX-FileCopyrightText: 2026 caixw
//
// SPDX-License-Identifier: MIT

/**
 * 运行期错误
 *
 * @remarks
 * 运行时发生的错误，比如类型错误、空指针等。
 */
export class RuntimeError extends Error {
	constructor(message?: string) {
		super(message);
		this.name = 'RuntimeError'
	}
}

/**
 * 网络错误
 *
 * @remarks
 * 与网络交互过程中发生的错误，比如后端返回的错误，或是无法连接网络等与网络相关的错误。
 */
export class NetworkError extends RuntimeError {
	constructor(message?: string) {
		super(message);
		this.name = 'NetworkError'
	}
}

/**
 * 权限不足引发的错误
 */
export class PermissionError extends RuntimeError {
	constructor(message?: string) {
		super(message);
		this.name = 'PermissionError'
	}
}
