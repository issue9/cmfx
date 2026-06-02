// SPDX-FileCopyrightText: 2025-2026 caixw
//
// SPDX-License-Identifier: MIT

import { getISOWeek, getISOWeekRange, getISOWeekRangeByWeek } from '@cmfx/core';
import { createEffect, type JSX, mergeProps, splitProps } from 'solid-js';

import type { BaseRef, RefProps, ValueProps } from '@components/base';
import type { CommonProps, CommonRef } from '@components/datetime/picker/internal';
import { CommonPanel } from '@components/datetime/picker/internal';
import type { WeekValueType } from '@components/datetime/view/month';
import { Form } from '@components/form';

export type PanelRef = BaseRef<HTMLFieldSetElement>;

export type Base = Omit<
	CommonProps,
	'viewRef' | 'onEnter' | 'onLeave' | 'ref' | 'popover' | 'weeks' | 'onWeekClick' | 'value' | 'onChange' | 'time'
> &
	ValueProps<WeekValueType>;

export type PanelProps = Base &
	RefProps<PanelRef> & {
		readonly popover?: false;
	};

/**
 * 周选择的面板
 */
export function Panel(props: PanelProps): JSX.Element {
	const form = Form.useForm();
	props = mergeProps({ tabindex: 0 }, form, props);
	const field = Form.useField(props, true);

	const [, panelProps] = splitProps(props, ['value', 'onChange', 'ref']);
	//const [value, setValue] = createSignal(props.value);
	let oldRange: Array<Date> = [];

	let ref: CommonRef;

	const change = (week: WeekValueType, range: [Date, Date]) => {
		const old = field.getValue();
		field.setValue(week);
		if (props.onChange) {
			props.onChange(week, old);
		}

		oldRange.forEach(item => {
			ref.dateview().unselect(item);
		});
		oldRange = [];

		for (let i = 0; i < 7; i++) {
			const day = new Date(range[0]);
			day.setDate(day.getDate() + i);

			ref.dateview().select(day);
			oldRange.push(day);
		}
	};

	createEffect(() => {
		if (!props.value) {
			oldRange.forEach(item => {
				ref.dateview().unselect(item);
			});
			oldRange = [];
			return;
		}

		const range = getISOWeekRangeByWeek(props.value[0], props.value[1]);
		change(props.value, range);
		ref.dateview().jump(range[0]);
	});

	return (
		<CommonPanel
			ref={el => {
				ref = el;

				if (props.ref) {
					props.ref({
						root: el.root,
					});
				}
			}}
			{...panelProps}
			weeks
			onLeave={() => {
				ref.dateview().uncover();
			}}
			onEnter={d => {
				ref.dateview().cover(getISOWeekRange(d));
			}}
			onChange={day => {
				if (!day) {
					return;
				}

				ref.dateview().unselect(day);
				change(getISOWeek(day), getISOWeekRange(day));
			}}
			onWeekClick={change}
		/>
	);
}
