// SPDX-FileCopyrightText: 2024-2025 caixw
//
// SPDX-License-Identifier: MIT

import { BaseProps } from '@/base';

/**
 * 组件的风格
 */
export const kinds = ['flat' , 'border' , 'fill'] as const;

export type Kind = typeof kinds[number];

export interface Props extends BaseProps {
    /**
     * 组件的展示风格
     */
    kind?: Kind;

    rounded?: boolean;
}

export const presetProps: Readonly<Props> = { kind: 'fill' };

