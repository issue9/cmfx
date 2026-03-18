// SPDX-FileCopyrightText: 2024-2026 caixw
//
// SPDX-License-Identifier: MIT

import { createEffect, createSignal, For, type JSX, mergeProps } from 'solid-js';
import IconPrev from '~icons/material-symbols/chevron-left';
import IconNext from '~icons/material-symbols/chevron-right';
import IconFirst from '~icons/material-symbols/first-page';
import IconLast from '~icons/material-symbols/last-page';

import type { BaseProps, BaseRef, ChangeFunc, RefProps } from '@components/base';
import { PropsError } from '@components/base';
import { Button, ButtonGroup } from '@components/button';
import { useLocale } from '@components/context';

export interface Ref extends BaseRef<ButtonGroup.RootRef> {
	/**
	 * 跳转到指定的页面
	 *
	 * @param p 页码；
	 */
	jump(p: number): void;
}

export interface Props extends BaseProps, RefProps<Ref> {
	/**
	 * 总的页码数量
	 *
	 * @reactive
	 */
	count: number;

	/**
	 * 当前页的页码，取值范围为 [1, {@link Props#count}]。
	 *
	 * @reactive
	 * @defaultValue 1
	 */
	value?: number;

	/**
	 * 在页码改变的时候触发
	 */
	onChange?: ChangeFunc<number>;

	/**
	 * 按钮的数量
	 *
	 * @reactive
	 */
	spans?: number;
}

const presetProps: Readonly<Partial<Props>> = {
	value: 1,
	spans: 3,
} as const;

/**
 * 分页组件
 *
 * 大致布局如下：
 * ```
 *  [<<,<,1,2,...,current...,7,8,>,>>]
 * ```
 */
export function Root(props: Props): JSX.Element {
	props = mergeProps(presetProps, props);
	const l = useLocale();

	const [prevs, setPrevs] = createSignal<Array<number>>([]);
	const [nexts, setNexts] = createSignal<Array<number>>([]);
	const [current, setCurrent] = createSignal(props.value!);

	const change = (page: number) => {
		const old = current();
		setCurrent(page);
		if (props.onChange) {
			props.onChange(page, old);
		}
	};

	// 监视 props.value 的变化
	createEffect(() => {
		if (props.value === undefined) {
			throw new PropsError('value', '无效的值，仅在初始化时允许为 undefined');
		}

		setCurrent(props.value);
	});

	createEffect(() => {
		if (current() > props.count) {
			change(props.count);
		}

		let min = current() - props.spans!;
		if (min < 1) {
			min = 1;
		}
		const pv: Array<number> = [];
		if (current() > min) {
			for (let i = min; i < current(); i++) {
				pv.push(i);
			}
		}
		setPrevs(pv);

		let max = current() + props.spans!;
		if (max > props.count) {
			max = props.count;
		}
		const nv: Array<number> = [];
		if (current() < max) {
			for (let i = current() + 1; i <= max; i++) {
				nv.push(i);
			}
		}
		setNexts(nv);
	});

	return (
		<ButtonGroup.Root
			palette={props.palette}
			class={props.class}
			style={props.style}
			ref={el => {
				el.root().role = 'navigation';

				if (props.ref) {
					props.ref({
						root: () => el,
						jump: (p: number) => change(p),
					});
				}
			}}
		>
			<Button.Root
				square
				onclick={() => change(1)}
				aria-label={l.t('_c.pagination.firstPage')}
				disabled={current() === 1}
			>
				<IconFirst />
			</Button.Root>

			<Button.Root
				square
				onclick={() => change(current() - 1)}
				disabled={current() === 1}
				ref={el => {
					el.root().ariaLabel = l.t('_c.pagination.prev');
				}}
			>
				<IconPrev />
			</Button.Root>

			<For each={prevs()}>
				{item => (
					<Button.Root ref={el => (el.root().ariaLabel = item.toString())} onclick={() => change(item)}>
						{item}
					</Button.Root>
				)}
			</For>

			<Button.Root ref={el => (el.root().ariaLabel = current().toString())} checked>
				{current()}
			</Button.Root>

			<For each={nexts()}>
				{item => (
					<Button.Root ref={el => (el.root().ariaLabel = item.toString())} onclick={() => change(item)}>
						{item}
					</Button.Root>
				)}
			</For>

			<Button.Root
				square
				onclick={() => change(current() + 1)}
				ref={el => (el.root().ariaLabel = l.t('_c.pagination.next'))}
				disabled={current() >= props.count}
			>
				<IconNext />
			</Button.Root>

			<Button.Root
				square
				onclick={() => change(props.count)}
				ref={el => (el.root().ariaLabel = l.t('_c.pagination.lastPage'))}
				disabled={current() >= props.count}
			>
				<IconLast />
			</Button.Root>
		</ButtonGroup.Root>
	);
}
