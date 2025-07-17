// SPDX-FileCopyrightText: 2025 caixw
//
// SPDX-License-Identifier: MIT

import { JSX } from 'solid-js';

import { CommonPanel, Props as CommonProps } from './common';

export type Props = Omit<CommonProps, 'viewRef' | 'onHover'>;

/**
 * 日期选择的面板
 */
export function DatePanel(props: Props): JSX.Element { return CommonPanel(props); }
