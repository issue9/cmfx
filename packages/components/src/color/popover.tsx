// SPDX-FileCopyrightText: 2025-2026 caixw
//
// SPDX-License-Identifier: MIT

import { type JSX, mergeProps, type ParentProps, splitProps } from 'solid-js';

import type { RefProps } from '@components/base';
import { Form } from '@components/form';
import type { Base, PanelRef } from './panel';
import { Panel } from './panel';

export type PopoverRef = Form.PopoverRef;

export interface PopoverProps extends Base, ParentProps, RefProps<PopoverRef> {
	readonly popover: Form.PopoverType;

	/**
	 * 作用在显示元素上的样式
	 *
	 * @reactive
	 */
	activatorClass?: string;

	/**
	 * 是否圆角
	 *
	 * @reactive
	 */
	rounded?: boolean;
}

export function Popover(props: PopoverProps): JSX.Element {
	let panelRef!: PanelRef;

	const form = Form.useForm();
	props = mergeProps({ tabindex: 0 }, form, props);

	const [panelProps, _] = splitProps(props, ['palette', 'wcag', 'spaces', 'value', 'onChange']);

	return (
		<Form.Popover
			value={props.value}
			onChange={props.onChange}
			popover={() => panelRef.root()}
			activatorClass={props.activatorClass}
			type={props.popover}
			rounded={props.rounded}
			readonly={props.readonly}
			disabled={props.disabled}
			formatter={f => f.getValue()}
			palette={props.palette}
			class={props.class}
			style={props.style}
			ref={props.ref}
		>
			<Panel {...panelProps} ref={el => (panelRef = el)} />
		</Form.Popover>
	);
}
