// SPDX-FileCopyrightText: 2024-2026 caixw
//
// SPDX-License-Identifier: MIT

import { createEffect, createSignal, type JSX, mergeProps, onCleanup, Show } from 'solid-js';

import { type BaseProps, type BaseRef, joinClass, type RefProps, type ValueProps } from '@components/base';
import { Time } from '@components/datetime/time';
import type { Week } from '@components/datetime/utils';
import { MonthView } from '@components/datetime/view/month';
import type { DatetimePlugin } from '@components/datetime/view/plugin';
import { Form } from '@components/form';
import { useForm } from '@components/form/form';
import styles from './style.module.css';

export interface CommonRef extends BaseRef<HTMLFieldSetElement> {
	// MonthView.RootRef 中的 jump 等方法无法精准到时间部分，不对外公开。
	dateview(): MonthView.RootRef;
}

export interface CommonProps extends BaseProps, Omit<Form.DataProps, 'rounded'>, ValueProps<Date>, RefProps<CommonRef> {
	/**
	 * 是否符带时间选择器
	 *
	 * @reactive
	 */
	time?: boolean;

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
	 * 点击周数时的回调函数
	 * @param week - 周数；
	 * @param range - 周数范围；
	 */
	onWeekClick?: MonthView.RootProps['onWeekClick'];

	popover?: boolean | 'manual' | 'auto';

	/**
	 * 翻页时的回调函数
	 * @param val - 新页面的日期；
	 * @param old - 旧页面的日期；
	 */
	onPaging?: MonthView.RootProps['onPaging'];

	onEnter?: MonthView.RootProps['onEnter'];
	onLeave?: MonthView.RootProps['onLeave'];

	/**
	 * 插件列表
	 *
	 * NOTE: 这是一个非响应式的属性。
	 */
	plugins?: Array<DatetimePlugin>;
}

export const presetProps: Partial<CommonProps> = {
	weekBase: 0,
} as const;

export function CommonPanel(props: CommonProps): JSX.Element {
	props = mergeProps(presetProps, props);
	const field = Form.useField(props, true);
	const form = useForm();
	props = mergeProps({ tabindex: 0 }, form, props);

	//const [value, setValue] = createSignal<Date | undefined>(props.value); // 实际的值
	const [dateViewRef, setDateViewRef] = createSignal<MonthView.RootRef>();

	// 改变值且触发 onchange 事件
	const change = (val?: Date) => {
		const old = field.getValue();

		if (val && !props.time) {
			if (old) {
				// 切换日期时，继承时间部分
				val.setHours(old.getHours(), old.getMinutes(), old.getSeconds());
			}

			dateViewRef()?.jump(val);
		}

		field.setValue(val);
		if (old) {
			dateViewRef()?.unselect(old);
		}
		if (val) {
			dateViewRef()?.select(val);
		}
	};

	let dateRef: HTMLFieldSetElement;
	const [timeRef, setTimeRef] = createSignal<Time.RootRef>();
	let resizeObserver: ResizeObserver;

	createEffect(() => {
		if (resizeObserver) {
			resizeObserver.disconnect();
		}

		// TODO: [CSS anchor](https://caniuse.com/?search=anchor) 支持全面的话，可以用 CSS 代替。
		resizeObserver = new ResizeObserver(entries => {
			const ref = timeRef();
			if (ref) {
				ref.root().style.height = `${entries[0]!.borderBoxSize[0].blockSize.toString()}px`;
			}
		});

		if (timeRef()) {
			resizeObserver.observe(dateRef!.firstChild as HTMLElement);
		}
	});

	onCleanup(() => {
		if (resizeObserver) {
			resizeObserver.disconnect();
		}
	});

	return (
		<fieldset
			disabled={props.disabled}
			popover={props.popover}
			class={joinClass(props.palette, styles.panel, props.class)}
			style={props.style}
			ref={el => (dateRef = el)}
		>
			<MonthView.Root
				initValue={field.getValue() ?? new Date()}
				min={props.min}
				max={props.max}
				disabledClass={styles.disabled}
				selectedClass={styles.selected}
				coveredClass={styles.covered}
				todayClass={styles.today}
				weekend={props.weekend}
				weekBase={props.weekBase}
				weekName="narrow"
				plugins={props.plugins}
				weeks={props.weeks}
				onWeekClick={props.onWeekClick}
				onEnter={props.onEnter}
				onLeave={props.onLeave}
				onPaging={props.onPaging}
				disabled={props.disabled}
				readonly={props.readonly}
				class={styles.dateview}
				onClick={(d, disabled) => {
					if (!disabled && !props.disabled && !props.readonly) {
						change(d);
					}
				}}
				ref={el => {
					setDateViewRef(el);
					if (props.ref) {
						props.ref({
							root: () => dateRef,
							dateview: () => el,
						});
					}
				}}
			/>

			<Show when={props.time}>
				<Time.Root
					disabled={props.disabled}
					readonly={props.readonly}
					value={field.getValue()}
					class={styles.timer}
					ref={el => setTimeRef(el)}
					onChange={d => {
						if (!props.disabled && !props.readonly) {
							change(d);
						}
					}}
				/>
			</Show>
		</fieldset>
	);
}
