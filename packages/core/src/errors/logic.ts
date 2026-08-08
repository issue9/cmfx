// SPDX-FileCopyrightText: 2026 caixw
//
// SPDX-License-Identifier: MIT

/**
 * 逻辑错误
 *
 * @remarks
 * 业务逻辑错误，比如参数错误、数据错误等。
 */
export class LogicError extends Error {
	constructor(message?: string) {
		super(message);
		this.name = 'LogicError';
	}
}
