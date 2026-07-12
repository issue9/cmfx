// SPDX-FileCopyrightText: 2025-2026 caixw
//
// SPDX-License-Identifier: MIT

import { joinClass, style2String } from '@cmfx/themes';
import type { JSX } from 'solid-js';
import {
	batch,
	createEffect,
	createMemo,
	createSignal,
	Match,
	mergeProps,
	onCleanup,
	Show,
	Switch,
	splitProps,
} from 'solid-js';

import type { BaseRef, RefProps, ValueProps } from '@components/base';
import { Button } from '@components/button';
import { useLocale } from '@components/context';
import type { CommonProps, CommonRef } from '@components/datetime/picker/internal';
import { CommonPanel } from '@components/datetime/picker/internal';
import { Form } from '@components/form';
import type { DateRangeValueType } from './shortcuts';
import { nextQuarter, nextYear, prevMonth, prevQuarter, prevYear, thisQuarter, thisYear } from './shortcuts';
import styles from './style.module.css';

export type PanelRef = BaseRef<HTMLFieldSetElement>;

export type Base = Omit<CommonProps, 'viewRef' | 'onEnter' | 'onLeave' | 'ref' | 'popover'> &
	ValueProps<DateRangeValueType> & {
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
	const form = Form.useForm();
	props = mergeProps({ tabindex: 0 }, form, props);
	const [_, panelProps] = splitProps(props, ['popover', 'ref', 'class', 'palette', 'style', 'ref']);

	const l = useLocale();
	const field = Form.useField(props, true);

	let index = 0; // 当前设置的值属于 field.getValue() 的哪个索引值

	const initValue = field.getValue();
	const [date1, sd1] = createSignal<Date | undefined>(initValue?.[0]);
	const setDate1 = (v?: Date) => {
		sd1(v);
		field.setValue([v, field.getValue()?.[1]]);
		index = 1;
	};

	const nextMonth = new Date();
	nextMonth.setMonth(nextMonth.getMonth() + 1);
	const [date2, sd2] = createSignal<Date | undefined>(initValue?.[1] ?? nextMonth);
	const setDate2 = (v?: Date) => {
		sd2(v);
		field.setValue([field.getValue()?.[0], v]);
		index = 0;
	};

	const setDate = (val?: Date) => {
		switch (index) {
			case 0:
				setDate1(val);
				break;
			case 1:
				setDate2(val);
				break;
		}
	};

	const [panel1, setPanel1] = createSignal<CommonRef>();
	let panel2: CommonRef;

	field.onChange((val, old) => {
		const view1 = panel1()?.monthView();
		const view2 = panel2.monthView();

		// 如果有旧的选择项，需要取消
		if (old) {
			view1?.unselect(...old);
			view2?.unselect(...old);
		}

		if (index === 0) {
			view1?.uncover();
			view2?.uncover();
			return;
		}

		// 以下为 index === 1 的情况

		if (val) {
			view1?.cover(val);
			view2?.cover(val);
		}

		if (val?.[0]) {
			view1?.jump(val[0]);

			view1?.select(val[0]);
			view2.select(val[0]);
		}
		if (val?.[1]) {
			view2.jump(val[1]);

			view1?.select(val[1]);
			view2.select(val[1]);
		}
	});

	const valueFormatter = createMemo(() => {
		return props.time ? l.datetimeFormat() : l.dateFormat();
	});

	const onEnter = (e: Date) => {
		if (index === 1) {
			const f = date1() ?? date2()!; // 由 index === 1 保证至少有一个值非 undefined 值
			panel1()?.monthView().cover([f, e]);
			panel2?.monthView().cover([f, e]);
		}
	};

	const onLeave = () => {
		if (index === 1) {
			panel1()?.monthView().uncover();
			panel2?.monthView().uncover();
		}
	};

	const setShortcuts = (vals: DateRangeValueType) => {
		batch(() => {
			setDate1(vals[0]);
			setDate2(vals[1]);
		});
	};

	/* 保证 flex-wrap 换行之后，边框显示的正确性 */

	let resizeObserver: ResizeObserver;
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
			class={joinClass(props.palette, styles.range, field.class, props.class)}
			style={style2String(field.style, props.style)}
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
						class={styles.panel}
						onEnter={onEnter}
						onLeave={onLeave}
						ref={setPanel1}
						onClick={val => setDate(val)}
						onPaging={val => {
							if (compareMonth(date2(), val) < 0) {
								const v = new Date(val);
								v.setMonth(v.getMonth() + 1);
								panel2.monthView().jump(v);
							}
						}}
					/>
					<CommonPanel
						{...panelProps}
						class={styles.panel}
						onEnter={onEnter}
						onLeave={onLeave}
						ref={el => (panel2 = el)}
						onClick={val => setDate(val)}
						onPaging={val => {
							if (compareMonth(date1(), val) > 0) {
								const v = new Date(val);
								v.setMonth(v.getMonth() - 1);
								panel1()?.monthView().jump(v);
							}
						}}
					/>
				</div>
				<div class={styles.value}>
					<Switch>
						<Match when={date1() && date2()}>{valueFormatter().formatRange(date1()!, date2()!)}</Match>
						<Match when={date1() || date2()}>{val => valueFormatter().format(val())}</Match>
					</Switch>
				</div>
			</main>

			<Show when={props.shortcuts}>
				<div class={styles.shortcuts}>
					<Button class="justify-start" onclick={() => setShortcuts(prevMonth())}>
						{l.t('_c.date.lastMonth')}
					</Button>

					<Button class="justify-start" onclick={() => setShortcuts(prevQuarter())}>
						{l.t('_c.date.lastQuarter')}
					</Button>
					<Button class="justify-start" onclick={() => setShortcuts(thisQuarter())}>
						{l.t('_c.date.thisQuarter')}
					</Button>
					<Button class="justify-start" onclick={() => setShortcuts(nextQuarter())}>
						{l.t('_c.date.nextQuarter')}
					</Button>

					<Button class="justify-start" onclick={() => setShortcuts(prevYear())}>
						{l.t('_c.date.lastYear')}
					</Button>
					<Button class="justify-start" onclick={() => setShortcuts(thisYear())}>
						{l.t('_c.date.thisYear')}
					</Button>
					<Button class="justify-start" onclick={() => setShortcuts(nextYear())}>
						{l.t('_c.date.nextYear')}
					</Button>
				</div>
			</Show>
		</fieldset>
	);
}

function compareMonth(d1?: Date, d2?: Date): number {
	if (!d1 || !d2) {
		return 0;
	}
	return d1.getMonth() - d2.getMonth() + (d1.getFullYear() - d2.getFullYear()) * 12;
}
