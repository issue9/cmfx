// SPDX-FileCopyrightText: 2025-2026 caixw
//
// SPDX-License-Identifier: MIT

import equal from 'fast-deep-equal';
import type { JSX } from 'solid-js';
import {
	createEffect,
	createMemo,
	createSignal,
	Match,
	mergeProps,
	onCleanup,
	onMount,
	Show,
	Switch,
	splitProps,
} from 'solid-js';

import { type BaseRef, joinClass, type RefProps, type ValueProps } from '@components/base';
import { Button } from '@components/button';
import { useLocale } from '@components/context';
import type { CommonProps, CommonRef } from '@components/datetime/picker/internal';
import { CommonPanel } from '@components/datetime/picker/internal';
import { Form } from '@components/form';
import type { ValueType } from './shortcuts';
import { nextQuarter, nextYear, prevMonth, prevQuarter, prevYear, thisQuarter, thisYear } from './shortcuts';
import styles from './style.module.css';

export type PanelRef = BaseRef<HTMLFieldSetElement>;

export type Base = Omit<CommonProps, 'value' | 'onChange' | 'viewRef' | 'onEnter' | 'onLeave' | 'ref' | 'popover'> &
	ValueProps<ValueType> & {
		/**
		 * 是否显示右侧快捷选择栏
		 *
		 * @reactive
		 */
		shortcuts?: boolean;
	};

export interface PanelProps extends Base, RefProps<PanelRef> {
	readonly popover?: false;
}

export function Panel(props: PanelProps): JSX.Element {
	const [_, panelProps] = splitProps(props, [
		'value',
		'onChange',
		'popover',
		'ref',
		'class',
		'palette',
		'style',
		'ref',
	]);

	const l = useLocale();

	const form = Form.useForm();
	props = mergeProps({ tabindex: 0 }, form, props);

	const field = Form.useField(props, true);
	const v = field.getValue();

	const [date1, sd1] = createSignal<Date>(v?.[0] ?? new Date());
	const setDate1 = (v: Date) => {
		sd1(v);
		const next = field.getValue()?.[1];
		field.setValue([v, next]);
	};

	const nextMonth = new Date();
	nextMonth.setMonth(nextMonth.getMonth() + 1);
	const [date2, sd2] = createSignal<Date>(v?.[1] ?? nextMonth);
	const setDate2 = (v: Date) => {
		sd2(v);
		const first = field.getValue()?.[0];
		field.setValue([first, v]);
	};

	let index = 0; // 当前设置的值属于 values 的哪个索引值

	const changeTime = (value: Date, first?: boolean) => {
		if (index === 1) {
			return;
		}

		const old = field.getValue() ?? [undefined, undefined];

		if (first) {
			const first = old[0];
			first?.setHours(value.getHours(), value.getMinutes(), value.getSeconds());
			field.setValue([first, old[1]]);
		} else {
			const secondary = old[1];
			secondary?.setHours(value.getHours(), value.getMinutes(), value.getSeconds());
			field.setValue([old[0], secondary]);
		}
	};

	// 面板值发生变化时，触发的事件
	//
	// time 是否只修改时间部分；
	// start 是否为修改第一个面板的值；
	// onchange 是否触发 onChange 事件；
	const panelChange = (value?: Date, start?: boolean, onchange?: boolean) => {
		const old = field.getValue();

		const viewRef1 = panel1()?.dateview();
		const viewRef2 = panel2?.dateview();

		if (!value) {
			// 只有在 Props.value === [undefined, undefined] 时才会有可能 !value 成立。
			if (old) {
				viewRef1?.unselect(...old);
				viewRef2?.unselect(...old);
			}
			viewRef1?.uncover();
			viewRef2?.uncover();
			return;
		}

		if (props.time) {
			// 对时间部分作了修改
			changeTime(value, start);
			return;
		}

		if (old) {
			viewRef1?.unselect(...old);
			viewRef2?.unselect(...old);
		}

		switch (index) {
			case 0: {
				const first = start ? old?.[0] : old?.[1];
				if (first) {
					// 改变日期，则继承之前的时间。
					value.setHours(first.getHours(), first.getMinutes(), first.getSeconds());
				}
				field.setValue(start ? [value, undefined] : [undefined, value]);
				viewRef1?.uncover();
				viewRef2?.uncover();
				break;
			}
			case 1: {
				const ret = old?.[0] ? [old[0], value] : [value, old?.[1]];
				ret.sort((a, b) => (a ? a.getTime() : 0) - (b ? b.getTime() : 0));
				field.setValue(ret as ValueType);
				const vals = field.getValue() as [Date, Date];
				viewRef1?.cover(vals);
				viewRef2.cover(vals);
				viewRef1?.jump(vals[0]!);
				viewRef2.jump(vals[1]!);
				break;
			}
		}

		viewRef1?.select(value);
		viewRef2?.select(value);

		index = index === 0 ? 1 : 0;

		const vals = field.getValue() as [Date, Date];
		if (props.onChange && onchange && !equal(vals, old)) {
			props.onChange(vals, old);
		}
	};

	// 监视外部直接通过 props.value 修改
	field.onChange((val, old) => {
		if (val === old || (val && equal(old, val))) {
			return;
		}

		const viewRef1 = panel1()?.dateview();
		const viewRef2 = panel2?.dateview();

		if (old) {
			viewRef1?.unselect(...old);
			viewRef2?.unselect(...old);
		}

		const v = val || [undefined, undefined];
		if (equal(v, [undefined, undefined])) {
			viewRef1?.uncover();
			viewRef2?.uncover();

			field.setValue(v);
			index = 0;

			return;
		}

		const vals = v as [Date, Date];
		viewRef1?.cover(vals);
		viewRef2?.cover(vals);

		if (vals[0]) {
			viewRef1?.jump(vals[0]);
			viewRef1?.select(vals[0]);
			changeTime(vals[0], true);
		}
		if (vals[1]) {
			viewRef2.jump(vals[1]);
			viewRef2.select(vals[1]);
			changeTime(vals[1], false);
		}

		field.setValue(vals);
		index = 0;
	});

	const valueFormater = createMemo(() => {
		return props.time ? l.datetimeFormat() : l.dateFormat();
	});

	onMount(() => {
		const nextMonth = new Date();
		nextMonth.setMonth(nextMonth.getMonth() + 1);
		const viewRef2 = panel2?.dateview();

		if (!props.value) {
			viewRef2.jump(nextMonth);
		} else if (!props.value[1]) {
			if (!props.value[0]) {
				viewRef2.jump(nextMonth);
			} else {
				const next = new Date(props.value[0]);
				next.setMonth(next.getMonth() + 1);
				viewRef2.jump(next);
			}
		}
	});

	const onEnter = (e: Date) => {
		if (index === 1) {
			const v = field.getValue() ?? [undefined, undefined];
			const f = v?.[0] ?? v[1]!; // 由 index === 1 保证至少有一个值非 undefined 值
			panel1()?.dateview().cover([f, e]);
			panel2?.dateview().cover([f, e]);
		}
	};

	const onLeave = () => {
		if (index === 1) {
			panel1()?.dateview().uncover();
			panel2?.dateview().uncover();
		}
	};

	const setShortcuts = (vals: ValueType) => {
		field.setValue(vals);

		const viewRef1 = panel1()?.dateview();
		const viewRef2 = panel2?.dateview();

		viewRef1?.cover(vals as [Date, Date]);
		viewRef2.cover(vals as [Date, Date]);
		viewRef1?.select(vals[0]!, vals[1]!);
		viewRef2.select(vals[0]!, vals[1]!);
		viewRef1?.jump(vals[0]!);
		viewRef2.jump(vals[1]!);
	};

	/* 保证 flex-wrap 换行之后，边框显示的正确性 */

	let resizeObserver: ResizeObserver;
	const [panel1, setPanel1] = createSignal<CommonRef>();
	let panel2: CommonRef;
	createEffect(() => {
		if (resizeObserver) {
			resizeObserver.disconnect();
		}

		// TODO: [CSS anchor](https://caniuse.com/?search=anchor) 支持全面的话，可以用 CSS 代替。
		resizeObserver = new ResizeObserver(entries => {
			const ref = panel1();
			if (ref) {
				const p2Left = (entries[0].target as HTMLElement).getBoundingClientRect().left;
				if (p2Left === ref.root().getBoundingClientRect().left) {
					panel2.root().style.setProperty('border-top-color', 'var(--palette-fg-low)');
					panel2.root().style.setProperty('border-inline-start-color', 'transparent');
				} else {
					panel2.root().style.setProperty('border-inline-start-color', 'var(--palette-fg-low)');
					panel2.root().style.setProperty('border-top-color', 'transparent');
				}
			}
		});

		if (panel1()) {
			resizeObserver.observe(panel2.root());
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
			class={joinClass(props.palette, styles.range, props.class)}
			style={props.style}
			ref={el => {
				if (props.ref) {
					props.ref({ root: () => el });
				}
			}}
		>
			<main>
				<div class={styles.panels}>
					<CommonPanel
						{...panelProps}
						value={field.getValue()?.[0]}
						class={styles.panel}
						onEnter={onEnter}
						onLeave={onLeave}
						ref={el => setPanel1(el)}
						onChange={val => {
							if (val === field.getValue()?.[0]) {
								return;
							}
							panelChange(val, true, true);
						}}
						onPaging={val => {
							setDate1(val);
							if (compareMonth(date2(), val) < 0) {
								const v = new Date(val);
								v.setMonth(v.getMonth() + 1);
								panel2.dateview().jump(v);
							}
						}}
					/>
					<CommonPanel
						{...panelProps}
						value={field.getValue()?.[1]}
						class={styles.panel}
						onEnter={onEnter}
						onLeave={onLeave}
						ref={el => {
							panel2 = el;
						}}
						onChange={val => {
							if (val === field.getValue()?.[1]) {
								return;
							}
							panelChange(val, false, true);
						}}
						onPaging={val => {
							setDate2(val);
							if (compareMonth(date1(), val) > 0) {
								const v = new Date(val);
								v.setMonth(v.getMonth() - 1);
								panel1()?.dateview().jump(v);
							}
						}}
					/>
				</div>
				<div class={styles.value}>
					<Switch>
						<Match when={field.getValue()?.[0] && field.getValue()?.[1]}>
							{valueFormater().formatRange(field.getValue()![0]!, field.getValue()![1]!)}
						</Match>
						<Match when={field.getValue()?.[0] || field.getValue()?.[1]}>
							{val => {
								return valueFormater().format(val());
							}}
						</Match>
					</Switch>
				</div>
			</main>

			<Show when={props.shortcuts}>
				<div class={styles.shortcuts}>
					<Button.Root class="justify-start" onclick={() => setShortcuts(prevMonth())}>
						{l.t('_c.date.lastMonth')}
					</Button.Root>

					<Button.Root class="justify-start" onclick={() => setShortcuts(prevQuarter())}>
						{l.t('_c.date.lastQuarter')}
					</Button.Root>
					<Button.Root class="justify-start" onclick={() => setShortcuts(thisQuarter())}>
						{l.t('_c.date.thisQuarter')}
					</Button.Root>
					<Button.Root class="justify-start" onclick={() => setShortcuts(nextQuarter())}>
						{l.t('_c.date.nextQuarter')}
					</Button.Root>

					<Button.Root class="justify-start" onclick={() => setShortcuts(prevYear())}>
						{l.t('_c.date.lastYear')}
					</Button.Root>
					<Button.Root class="justify-start" onclick={() => setShortcuts(thisYear())}>
						{l.t('_c.date.thisYear')}
					</Button.Root>
					<Button.Root class="justify-start" onclick={() => setShortcuts(nextYear())}>
						{l.t('_c.date.nextYear')}
					</Button.Root>
				</div>
			</Show>
		</fieldset>
	);
}

function compareMonth(d1: Date, d2: Date): number {
	return d1.getMonth() - d2.getMonth() + (d1.getFullYear() - d2.getFullYear()) * 12;
}
