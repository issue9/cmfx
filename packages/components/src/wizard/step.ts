// SPDX-FileCopyrightText: 2025-2026 caixw
//
// SPDX-License-Identifier: MIT

import { JSX } from 'solid-js';

/**
 * 每一步向导的属性
 */
export interface Step {
	/**
	 * 向导的内容
	 */
	content: JSX.Element;

	/**
	 * 标题
	 */
	title?: string;
}

export interface Ref {
	/**
	 * 下一步
	 */
	next: () => void;

	/**
	 * 上一步
	 */
	prev: () => void;
}
