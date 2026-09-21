// SPDX-FileCopyrightText: 2026 caixw
//
// SPDX-License-Identifier: MIT

import type { FormContextOptions } from '@cmfx/cdk';
import type { Flattenable } from '@cmfx/core';
import { type Component, type JSX, mergeProps } from 'solid-js';

import { Field, type FormFieldProps } from './field';
import { Form, type FormProps } from './form';

type CreateFormProps<T extends Flattenable, R = unknown, P = never> = Omit<
	FormProps<T, R, P>,
	'load' | 'submit' | 'validOnChange' | 'validator' | 'onSuccess' | 'onProblem' | 'initValue'
>;

/**
 * 创建指定类型的 Form 和 Filed 组件
 *
 * @param opt 初始化选项
 * @returns 返回三个参数，[Form, Field, api]，分别与 Form、Form.Field 和 Form.API 相对应。
 */
export function create<T extends Flattenable, R = unknown, P = never>(
	opt: FormContextOptions<T, R, P>,
): [Form: Component<CreateFormProps<T, R, P>>, Field: Component<FormFieldProps<T>>] {
	const form = (props: CreateFormProps<T, R, P>): JSX.Element => {
		return Form<T, R, P>(mergeProps({}, opt, props));
	};

	const field = (props: FormFieldProps<T>): JSX.Element => {
		return Field<T>(props);
	};

	return [form, field];
}
