// SPDX-FileCopyrightText: 2026 caixw
//
// SPDX-License-Identifier: MIT

import type { Flattenable } from '@cmfx/core';
import { type Component, type JSX, mergeProps } from 'solid-js';

import { API, type Options } from './api';
import { Field, type FieldProps } from './field';
import type { Props } from './root';
import { Root } from './root';

/**
 * 创建指定类型的 Form 和 Filed 组件
 *
 * @param opt 初始化选项
 * @returns 返回两个参数，[Form, Field]，分别与 Form.Root 和 Form.Field 相对应。
 */
export function create<T extends Flattenable, R = never, P = never>(
	opt: Options<T, R, P>,
): [Form: Component<Props<T, R, P>>, Field: Component<FieldProps<T>>] {
	const form = (props: Props<T, R, P>): JSX.Element => {
		return Root<T, R, P>(mergeProps({ api: new API(opt) }, props));
	};

	return [form, Field<T>];
}
