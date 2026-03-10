// SPDX-FileCopyrightText: 2025-2026 caixw
//
// SPDX-License-Identifier: MIT

import { getISOWeek, getISOWeekRange, getISOWeekRangeByWeek } from '@cmfx/core';
import { createEffect, createSignal, JSX, splitProps, untrack } from 'solid-js';

import { ChangeFunc, RefProps } from '@components/base';
import { CommonPanel, Props as CommonProps, Ref as CommonRef } from '@components/datetime/datepanel/common/common.tsx';
import { WeekValueType } from '@components/datetime/dateview';

export interface Ref {
	root(): HTMLFieldSetElement;
}

export type Props = Omit<CommonProps, 'onEnter' | 'onLeave' | 'weeks' | 'onWeekClick' | 'value' | 'onChange' | 'ref'> &
	RefProps<Ref> & {
		/**
		 * 关联的值
		 *
		 * @reactive
		 */
		value?: WeekValueType;

		/**
		 * 值发生改变时触发的事件
		 *
		 * val 表示修改的新值；
		 * old 表示修改之前的值；
		 */
		onChange?: ChangeFunc<WeekValueType>;
	};

/**
 * 周选择的面板
 */
export function Root(props: Props): JSX.Element {
	const [, panelProps] = splitProps(props, ['value', 'onChange', 'ref']);
	const [value, setValue] = createSignal(props.value);
	let oldRange: Array<Date> = [];

	let ref: CommonRef;

	const change = (week: WeekValueType, range: [Date, Date]) => {
		const old = untrack(value);
		setValue(week);
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
