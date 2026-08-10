// SPDX-FileCopyrightText: 2026 caixw
//
// SPDX-License-Identifier: MIT

import { describe, expect, test } from 'vitest';

import { ContextNotFoundError, PropsError } from './logic';

describe('LogicError', () => {
	test('ContextNotFoundError', () => {
		const err = new ContextNotFoundError('ctx');

		expect(err).toBeInstanceOf(ContextNotFoundError);
		expect(err.context).toEqual('ctx');
		expect(err.message).toEqual('无法找到上下文环境：ctx');
		expect(Error.isError(err)).toBe(true);
		expect(err.name).toEqual('ContextNotFoundError');
	});

	test('PropsError', () => {
		const err = new PropsError('prop1', '不能为空');

		expect(err).toBeInstanceOf(PropsError);
		expect(err.prop).toEqual('prop1');
		expect(err.message).toEqual('属性错误：prop1 - 不能为空');
		expect(Error.isError(err)).toBe(true);
		expect(err.name).toEqual('PropsError');
	});
});
