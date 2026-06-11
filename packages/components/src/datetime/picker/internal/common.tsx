// SPDX-FileCopyrightText: 2024-2026 caixw
//
// SPDX-License-Identifier: MIT

import { createEffect, createSignal, type JSX, onCleanup, Show } from 'solid-js';

import { type BaseProps, type BaseRef, joinClass, type RefProps } from '@components/base';
import { Time } from '@components/datetime/time';
import type { Week } from '@components/datetime/utils';
import { MonthView } from '@components/datetime/view/month';
import type { DatetimePlugin } from '@components/datetime/view/plugin';
import { Form } from '@components/form';
import styles from './style.module.css';

export interface CommonRef extends BaseRef<HTMLFieldSetElement> {
	// MonthView.Ref 中的 jump 等方法无法精准到时间部分，不对外公开。
	monthView(): MonthView.Ref;
}

export interface CommonProps extends BaseProps, Omit<Form.DataProps, 'rounded'>, RefProps<CommonRef> {
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

	popover?: boolean | 'manual' | 'auto';

	readonly onWeekClick?: MonthView.Props['onWeekClick'];
	readonly onPaging?: MonthView.Props['onPaging'];
	readonly onEnter?: MonthView.Props['onEnter'];
	readonly onLeave?: MonthView.Props['onLeave'];
	readonly onClick?: MonthView.Props['onClick'];
	readonly plugins?: Array<DatetimePlugin>;
	readonly onTimeChange?: Time.Props['onChange'];
	readonly initTime?: Date;
}

export const presetProps: Partial<CommonProps> = {
	weekBase: 0,
} as const;

export function CommonPanel(props: CommonProps): JSX.Element {
	let rootRef: HTMLFieldSetElement;
	const [timeRef, setTimeRef] = createSignal<Time.Ref>();

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
			resizeObserver.observe(rootRef!.firstChild as HTMLElement);
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
			ref={el => (rootRef = el)}
		>
			<MonthView
				initValue={new Date()}
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
				onClick={props.onClick}
				onPaging={props.onPaging}
				disabled={props.disabled}
				readonly={props.readonly}
				class={styles.dateview}
				ref={el => {
					if (props.ref) {
						props.ref({
							root: () => rootRef,
							monthView: () => el,
						});
					}
				}}
			/>

			<Show when={props.time}>
				<Form.FieldProvider isolation>
					<Time
						disabled={props.disabled}
						readonly={props.readonly}
						value={props.initTime}
						class={styles.timer}
						ref={el => setTimeRef(el)}
						onChange={props.onTimeChange}
					/>
				</Form.FieldProvider>
			</Show>
		</fieldset>
	);
}
