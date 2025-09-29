// SPDX-FileCopyrightText: 2024-2025 caixw
//
// SPDX-License-Identifier: MIT

import { Hotkey } from '@cmfx/core';

import { BaseProps } from '@/base';

/**
 * 组件的风格
 *
 * @remarks 组件的展示风格，包含以下几种取值：
 *  - flat 无背景，无边框；
 *  - border 无背景，有边框；
 *  - fill 有背景，有边框；
 */
export const kinds = ['flat' , 'border' , 'fill'] as const;

export type Kind = typeof kinds[number];

export interface Props extends BaseProps {
    /**
     * 组件的展示风格
     */
    kind?: Kind;

    rounded?: boolean;

    hotkey?: Hotkey;
}

export const presetProps: Readonly<Props> = { kind: 'fill' };
