// SPDX-FileCopyrightText: 2024 caixw
//
// SPDX-License-Identifier: MIT

import { BaseProps } from '@/components/base';

export const styles = ['flated' , 'bordered' , 'filled'] as const;

export type Style = typeof styles[number];

export interface Props extends BaseProps {
    style?: Style;
    rounded?: boolean;
    disabled?: boolean;
}
