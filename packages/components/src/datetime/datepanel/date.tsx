// SPDX-FileCopyrightText: 2025-2026 caixw
//
// SPDX-License-Identifier: MIT

import { JSX } from 'solid-js';

import { CommonPanel, Props as CommonProps } from './common';

export type Props = Omit<CommonProps, 'viewRef' | 'onEnter' | 'onLeave'>;

/**
 * 日期选择的面板
 */
export function DatePanel(props: Props): JSX.Element {
	return CommonPanel(props);
}
