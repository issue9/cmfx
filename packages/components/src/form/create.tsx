// SPDX-FileCopyrightText: 2026 caixw
//
// SPDX-License-Identifier: MIT

import type { Flattenable } from '@cmfx/core';
import { type Component, type JSX, mergeProps } from 'solid-js';

import { API, type Options } from './api';
import { Field, type FormFieldProps } from './field';
import type { FormProps } from './form';
import { Form } from './form';

type FormCreatorProps<T extends Flattenable, R = never, P = never> = Omit<FormProps<T, R, P>, 'api'>;

/**
 * 创建指定类型的 Form 和 Filed 组件
 *
 * @param opt 初始化选项
 * @returns 返回三个参数，[Form, Field, api]，分别与 Form、Form.Field 和 Form.API 相对应。
 */
export function create<T extends Flattenable, R = never, P = never>(
	opt: Options<T, R, P>,
): [Form: Component<FormCreatorProps<T, R, P>>, Field: Component<FormFieldProps<T>>, api: API<T, R, P>] {
	const api = new API(opt);

	const form = (props: FormCreatorProps<T, R, P>): JSX.Element => {
		return Form<T, R, P>(mergeProps({ api }, props));
	};

	return [form, Field<T>, api];
}
