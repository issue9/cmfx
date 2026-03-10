// SPDX-FileCopyrightText: 2024-2026 caixw
//
// SPDX-License-Identifier: MIT

import { Hotkey } from '@cmfx/core';

import { BaseProps } from '@components/base';

export const kinds = ['flat', 'border', 'fill'] as const;

/**
 * 组件的风格
 *
 * @remarks 组件的展示风格，包含以下几种取值：
 *  - flat 无背景，无边框；
 *  - border 无背景，有边框；
 *  - fill 有背景，有边框；
 */
export type Kind = (typeof kinds)[number];

export interface Props extends BaseProps {
	/**
	 * 是否禁用
	 *
	 * @reactive
	 */
	disabled?: boolean;

	/**
	 * 组件的展示风格
	 *
	 * @reactive
	 *
	 * @defaultValue 'fill'
	 */
	kind?: Kind;

	/**
	 * 是否为圆角
	 *
	 * @reactive
	 */
	rounded?: boolean;

	/**
	 * 快捷键
	 */
	hotkey?: Hotkey;
}

export const presetProps: Readonly<Props> = { kind: 'fill' };
