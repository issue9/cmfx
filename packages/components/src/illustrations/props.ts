// SPDX-FileCopyrightText: 2025 caixw
//
// SPDX-License-Identifier: MIT

import { ComponentProps } from 'solid-js';

import { BaseProps, joinClass } from '@/base';

export type Props = ComponentProps<'svg'> & BaseProps & {
    /**
     * 组件内的提示文字
     */
    text?: string;
};

export function buildClass(props: Props): string | undefined {
    return joinClass(props.palette ? `palette--${props.palette}` : '', 'text-palette-fg', props.class)
}
