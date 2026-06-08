// SPDX-FileCopyrightText: 2025-2026 caixw
//
// SPDX-License-Identifier: MIT

import { type JSX, mergeProps, splitProps } from 'solid-js';

import type { BaseProps, BaseRef, RefProps, ValueProps } from '@components/base';
import { CommonPanel, type CommonProps, presetProps } from '@components/datetime/picker/internal';
import type { Week } from '@components/datetime/utils';
import type { DatetimePlugin } from '@components/datetime/view/plugin';
import { Form } from '@components/form';

export type PanelRef = BaseRef<HTMLFieldSetElement>;

export interface Base extends BaseProps, ValueProps<Date>, Omit<Form.DataProps, 'rounded'> {
	/**
	 * 是否符带时间选择器
	 */
	readonly time?: boolean;

	/**
	 * 允许的最小日期
	 */
	min?: Date;

	/**
	 * 允许的最大日期
	 */
	max?: Date;

	/**
	 * 是否高亮周末的列
	 *
	 * @reactive
	 */
	weekend?: boolean;

	/**
	 * 一周的开始，默认为 0，即周日。
	 *
	 * @reactive
	 */
	weekBase?: Week;

	/**
	 * 是否显示周数
	 *
	 * NOTE: 周数是依据 ISO 8601 拿所在行的中间列计算所得。
	 * 如果 {@link CommonProps#weekBase} 不为 1，那么周数指向的可能并不是当前行。
	 *
	 * @reactive
	 */
	weeks?: boolean;

	/**
	 * 插件列表
	 *
	 * NOTE: 这是一个非响应式的属性。
	 */
	readonly plugins?: Array<DatetimePlugin>;
}

export interface PanelProps extends Base, RefProps<PanelRef> {
	readonly popover?: false;
}

/**
 * 日期选择的面板
 */
export function Panel(props: PanelProps): JSX.Element {
	props = mergeProps(presetProps as PanelProps, props);
	const form = Form.useForm();
	props = mergeProps({ tabindex: 0 }, form, props);

	const field = Form.useField(props, true);
	const [_, p] = splitProps(props, ['ref', 'onChange', 'value']);
	let time: Date | undefined = field.getValue();

	return (
		<CommonPanel
			{...p}
			initTime={time}
			onTimeChange={e => {
				const old = field.getValue();
				const v = old ? new Date(old.getDate()) : undefined; // 需要解构 old
				time = e;

				if (v && e) {
					v.setHours(e.getHours());
					v.setMinutes(e.getMinutes());
					v.setSeconds(e.getSeconds());
					field.setValue(v);
				}
			}}
			onClick={d => {
				if (time) {
					d.setHours(time.getHours());
					d.setMinutes(time.getMinutes());
					d.setSeconds(time.getSeconds());
				}

				field.setValue(d);
			}}
			ref={el => {
				if (props.ref) {
					props.ref({
						root: el.root,
					});
				}
			}}
		/>
	);
}
