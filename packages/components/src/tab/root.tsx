// SPDX-FileCopyrightText: 2024-2026 caixw
//
// SPDX-License-Identifier: MIT

import { joinClass } from '@cmfx/themes';
import type { JSX } from 'solid-js';
import { createEffect, createMemo, createSignal, For, mergeProps, onCleanup, onMount, Show, untrack } from 'solid-js';
import IconPrev from '~icons/material-symbols/chevron-left';
import IconNext from '~icons/material-symbols/chevron-right';

import type { Layout } from '@components/base';
import { Button } from '@components/button';
import styles from './style.module.css';
import type { TabItem, TabProps } from './types';

/**
 * Tab 组件
 */
export function Tab(props: TabProps): JSX.Element {
	props = mergeProps({ layout: 'horizontal' as Layout }, props);
	const layout = props.layout!;

	const [val, setVal] = createSignal<TabItem['id']>(props.value ?? props.items[0].id);

	const click = (v: TabItem['id']): void => {
		const old = untrack(val);
		if (v === old) {
			return;
		}

		if (props.onChange) {
			props.onChange(v, old);
		}
		setVal(() => v);
	};

	// 监视 props.value 的变化
	createEffect(() => {
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
		onCleanup(() => observer.disconnect());
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
						root: () => el,
						switch: (id: TabItem['id']) => click(id),
						scroll: (delta: number) => scroll(new MouseEvent('click'), delta),
					});
				}
			}}
		>
			<div ref={el => (tabsRef = el)} class={joinClass(undefined, styles.tabs, props.tabsClass)}>
				<Show when={isOverflow()}>
					<Button kind="flat" class={styles.prev} onclick={e => scroll(e, -40)}>
						<IconPrev class={layout === 'vertical' ? 'rotate-90' : undefined} />
					</Button>
				</Show>

				<div ref={el => (scrollerRef = el)} class={styles.scroller} onwheel={wheel}>
					<div>
						<For each={props.items}>
							{item => (
								<Button
									kind="flat"
									ref={el => (el.root().role = 'tab')}
									aria-selected={val() === item.id}
									disabled={item.disabled}
									checked={val() === item.id}
									class={styles.item}
									onclick={() => click(item.id)}
								>
									{item.label}
								</Button>
							)}
						</For>
					</div>
				</div>
				<Show when={isOverflow()}>
					<Button kind="flat" class={styles.next} onclick={e => scroll(e, 40)}>
						<IconNext class={layout === 'vertical' ? 'rotate-90' : undefined} />
					</Button>
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
