// SPDX-FileCopyrightText: 2025-2026 caixw
//
// SPDX-License-Identifier: MIT

import { BaseProps, joinClass, RefProps } from '@cmfx/components';

export interface Ref {
    /**
     * 组件的引用
     */
    root(): SVGSVGElement;
}

export interface Props extends BaseProps, RefProps<Ref> {
    /**
     * 组件内的提示文字
     */
    text?: string;
}

export function buildClass(props: Props): string | undefined {
    return joinClass(props.palette, 'text-palette-fg', props.class);
}
