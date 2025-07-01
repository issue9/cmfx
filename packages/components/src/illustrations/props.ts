// SPDX-FileCopyrightText: 2025 caixw
//
// SPDX-License-Identifier: MIT

import { ComponentProps } from 'solid-js';

export type Props = ComponentProps<'svg'> & {
    /**
     * 组件内的提示文字
     */
    text?: string;
};
