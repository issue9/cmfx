// SPDX-FileCopyrightText: 2024 caixw
//
// SPDX-License-Identifier: MIT

import { JSX } from 'solid-js';

import { BaseProps } from '@/components/base';

/**
 * 组件的风格
 */
export const styles = ['flat' , 'border' , 'fill'] as const;

export type Style = typeof styles[number];

export interface Props extends BaseProps {
    /**
     * 组件的展示风格
     */
    style?: Style;

    rounded?: boolean;

    disabled?: boolean;
}

export type ClickFunc = NonNullable<JSX.ButtonHTMLAttributes<HTMLButtonElement>['onClick']>;

export type ButtonType = NonNullable<JSX.ButtonHTMLAttributes <HTMLButtonElement> ['type']>;

export const defaultProps: Readonly<Props> = { style: 'fill' };
