// SPDX-FileCopyrightText: 2025-2026 caixw
//
// SPDX-License-Identifier: MIT

import { getISOWeek, getISOWeekRange, getISOWeekRangeByWeek } from '@cmfx/core';
import { type JSX, mergeProps, splitProps } from 'solid-js';

import type { BaseProps, BaseRef, RefProps, ValueProps } from '@components/base';
import { joinClass, style2String } from '@components/base';
import type { Week } from '@components/datetime/utils';
import { MonthView } from '@components/datetime/view/month';
import type { DatetimePlugin } from '@components/datetime/view/plugin';
import { Form } from '@components/form';
import styles from './style.module.css';

export type PanelRef = BaseRef<HTMLFieldSetElement>;

export interface Base extends BaseProps, ValueProps<MonthView.WeekValueType>, Omit<Form.DataProps, 'rounded'> {
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
	 * 插件列表
	 *
	 * NOTE: 这是一个非响应式的属性。
	 */
	readonly plugins?: Array<DatetimePlugin>;
}

export interface PanelProps extends Base, RefProps<PanelRef> {
	readonly popover?: false;
}

export function Panel(props: PanelProps): JSX.Element {
	const form = Form.useForm();
	props = mergeProps({ tabindex: 0 }, form, props);
	const field = Form.useField(props, true);

	const [, panelProps] = splitProps(props, ['value', 'onChange', 'ref', 'popover', 'class', 'style']);
	let oldRange: Array<Date> = [];

	let ref: MonthView.Ref;

	const change = (week: MonthView.WeekValueType, range: [Date, Date]) => {
		field.setValue(week);

		oldRange.forEach(item => {
			ref.unselect(item);
		});
		oldRange = [];

		for (let i = 0; i < 7; i++) {
			const day = new Date(range[0]);
			day.setDate(day.getDate() + i);

			ref.select(day);
			oldRange.push(day);
		}
	};

	const initValue = field.getValue();
	return (
		<MonthView
			ref={el => {
				ref = el;

				if (props.ref) {
					props.ref({
						root: el.root,
					});
				}
			}}
			{...panelProps}
			class={joinClass(undefined, styles.week, field.class, props.class)}
			style={style2String(field.style, props.style)}
			initValue={initValue ? getISOWeekRangeByWeek(initValue[0], initValue[1])[0] : new Date()}
			weeks
			weekName="narrow"
			todayClass={styles.today}
			disabledClass={styles.disabled}
			selectedClass={styles.selected}
			coveredClass={styles.covered}
			onLeave={() => ref.uncover()}
			onEnter={d => ref.cover(getISOWeekRange(d))}
			onClick={d => change(getISOWeek(d), getISOWeekRange(d))}
			onWeekClick={change}
		/>
	);
}
