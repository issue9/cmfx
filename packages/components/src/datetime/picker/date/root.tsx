// SPDX-FileCopyrightText: 2026 caixw
//
// SPDX-License-Identifier: MIT

import type { JSX } from 'solid-js';

import { Panel, type PanelProps, type PanelRef } from './panel';
import { Popover, type PopoverProps, type PopoverRef } from './popover';

export type DatePickerRef<P extends boolean = false> = P extends true ? PopoverRef : PanelRef;

export type DatePickerProps = PopoverProps | PanelProps;

/**
 * 颜色拾取面板
 *
 * @remarks
 * 根据参数 props.popover 决定显示方式，为 true 时显示弹出面板，为 false 时显示面板。
 */
export function DatePicker(props: DatePickerProps): JSX.Element {
	if (props.popover) {
		return <Popover {...props} />;
	}
	return <Panel {...props} />;
}
