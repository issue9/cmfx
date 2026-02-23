// SPDX-FileCopyrightText: 2024-2026 caixw
//
// SPDX-License-Identifier: MIT

import { createEffect, createMemo, createSignal, For, mergeProps, onCleanup, onMount, Show, untrack } from 'solid-js';
import IconPrev from '~icons/material-symbols/chevron-left';
import IconNext from '~icons/material-symbols/chevron-right';

import { joinClass, Layout } from '@components/base';
import styles from './style.module.css';
import { Item, Props } from './types';

/**
 * Tab 组件
 */
export function Tab(props: Props) {
	props = mergeProps({ layout: 'horizontal' as Layout }, props);
	const layout = props.layout!;

	const [val, setVal] = createSignal<Item['id']>(props.value ?? props.items[0].id);

	const click = (v: Item['id']): void => {
		const old = untrack(val);
		if (v === old) {
			return;
		}

		if (props.onChange) {
			props.onChange(v, old);
		}
		setVal(() => v);
	};

	createEffect(() => {
		// 监视 props.value 的变化
		const v = props.value;
		const old = untrack(val);
		if (old === v) {
			return;
		}

		setVal(() => v ?? props.items[0].id);
	});

	const [isOverflow, setIsOverflow] = createSignal(false);

	let rootRef: HTMLDivElement;
	let tabsRef: HTMLDivElement;
	let scrollerRef: HTMLDivElement;

	// 确定是否需要显示溢出的情况
	onMount(() => {
		const observer = new ResizeObserver(() => {
			if (!tabsRef || !rootRef) {
				return;
			}

			if (layout === 'horizontal') {
				setIsOverflow(scrollerRef.scrollWidth > rootRef.clientWidth);
			} else {
				setIsOverflow(scrollerRef.scrollHeight > rootRef.clientHeight);
			}
		});

		observer.observe(tabsRef);
		onCleanup(() => {
			observer.disconnect();
		});
	});

	// 组件根元素的 css
	const cls = createMemo(() => {
		return joinClass(
			props.palette,
			styles.tab,
			layout === 'vertical' ? styles.vertical : styles.horizontal,
			props.class,
		);
	});

	// 鼠标滚轮事件
	const wheel = (e: WheelEvent) => {
		if (!scrollerRef) {
			return;
		}

		e.preventDefault();
		if (e.deltaY === 0) {
			return;
		}

		if (layout === 'horizontal') {
			scrollerRef.scrollBy({ left: e.deltaY, behavior: 'smooth' });
		} else {
			scrollerRef.scrollBy({ top: e.deltaY, behavior: 'smooth' });
		}
	};

	// 两侧按钮的事件，delta 表示滚动去方向，负数向前，正数向后。
	const scroll = (e: MouseEvent, delta: number) => {
		if (!scrollerRef) {
			return;
		}

		e.preventDefault();

		if (layout === 'horizontal') {
			scrollerRef.scrollBy({ left: delta, behavior: 'smooth' });
		} else {
			scrollerRef.scrollBy({ top: delta, behavior: 'smooth' });
		}
	};

	return (
		<div
			role="tablist"
			aria-orientation={layout}
			class={cls()}
			style={props.style}
			ref={el => {
				rootRef = el;
				if (props.ref) {
					props.ref({
						root() {
							return el;
						},
						switch(id: Item['id']) {
							click(id);
						},
						scroll(delta: number) {
							scroll(new MouseEvent('click'), delta);
						},
					});
				}
			}}
		>
			<div
				ref={el => (tabsRef = el)}
				class={joinClass(undefined, styles.tabs, props.children ? styles['has-panel'] : '')}
			>
				<Show when={isOverflow()}>
					<button type="button" class={styles.prev} onclick={e => scroll(e, -40)}>
						<IconPrev class={layout === 'vertical' ? 'rotate-90' : undefined} />
					</button>
				</Show>

				<div
					ref={el => {
						scrollerRef = el;
					}}
					class={styles.scroller}
					onwheel={wheel}
				>
					<div>
						<For each={props.items}>
							{item => (
								<button
									type="button"
									role="tab"
									aria-selected={val() === item.id}
									disabled={item.disabled}
									class={joinClass(undefined, styles.item, val() === item.id ? styles.select : '')}
									onClick={() => {
										click(item.id);
									}}
								>
									{item.label}
								</button>
							)}
						</For>
					</div>
				</div>
				<Show when={isOverflow()}>
					<button type="button" class={styles.next} onclick={e => scroll(e, 40)}>
						<IconNext class={layout === 'vertical' ? 'rotate-90' : undefined} />
					</button>
				</Show>
			</div>

			<Show when={props.children}>
				{c => (
					<div role="tabpanel" class={props.panelClass}>
						{c()}
					</div>
				)}
			</Show>
		</div>
	);
}
