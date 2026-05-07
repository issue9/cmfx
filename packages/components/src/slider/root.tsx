// SPDX-FileCopyrightText: 2025-2026 caixw
//
// SPDX-License-Identifier: MIT

import type { JSX } from 'solid-js';
import { createEffect, createSignal, For, mergeProps, onCleanup, onMount, Show } from 'solid-js';

import { type BaseProps, type BaseRef, type ChangeFunc, joinClass, type RefProps } from '@components/base';
import { Form } from '@components/form';
import styles from './style.module.css';

export interface Ref extends BaseRef<HTMLDivElement> {
	/**
	 * 组件中实际用于输入的 input 元素
	 */
	input(): HTMLInputElement;
}

export interface Props extends Form.InputProps, BaseProps, RefProps<Ref> {
	/**
	 * 最小值
	 *
	 * @reactive
	 */
	min?: number;

	/**
	 * 最大值
	 *
	 * @reactive
	 */
	max?: number;

	/**
	 * 步长
	 *
	 * @reactive
	 */
	step?: number;

	/**
	 * 滑轨和滑块拥有相同的调度
	 *
	 * @reactive
	 */
	fitHeight?: boolean;

	/**
	 * 可以在滑轨上作一些标记
	 *
	 * @remarks
	 * 要求这些标记点必须在 {@link Props#min} 和 {@link Props#max} 之间。
	 * 所以 marks 不为空时，min 和 max 是不能为空的。
	 */
	marks?: Array<[number, string]>;

	/**
	 * 对内容进行格式化并显示在 extra 区别
	 */
	format?: (value: number | undefined) => JSX.Element;

	value?: number;

	onChange?: ChangeFunc<number | undefined>;
}

/**
 * 相当于 <input type="range" />
 */
export function Root(props: Props): JSX.Element {
	const field = Form.useField<number>() ?? Form.buildFakeFieldContext(props.value);
	const form = Form.useForm();
	props = mergeProps({ tabindex: 0 }, form, props);

	const [marks, setMarks] = createSignal<Array<[val: number, title: JSX.Element, offset: number]>>([]);
	let rootRef: HTMLDivElement;
	let inputRef: HTMLInputElement;

	createEffect(() => {
		field.setValue(props.value);
	});

	createEffect(() => {
		if (props.format) {
			field.setExtra(props.format(field.getValue()));
		}
	});

	const wheel = (e: WheelEvent) => {
		if (props.readonly || props.disabled) {
			return;
		}

		e.preventDefault();
		const step = props.step ?? 1;

		let v = field.getValue() ?? 0 + (e.deltaY > 0 ? step : -step);
		if (props.max !== undefined && v > props.max) {
			v = props.max;
		}
		if (props.min !== undefined && v < props.min) {
			v = props.min;
		}
		field.setValue(v);
		field.setError();
	};

	onMount(() => {
		// TODO: [CSS anchor](https://caniuse.com/?search=anchor) 支持全面的话，可以用 CSS 代替。
		const resizeObserver = new ResizeObserver(entries => {
			const h = entries[0].contentBoxSize[0].blockSize / 2;
			rootRef.style.setProperty('--range-marks-item-top', `calc(-${h}px - 50%)`);
		});

		resizeObserver.observe(inputRef);
		onCleanup(() => {
			resizeObserver.disconnect();
		});
	});

	createEffect(() => {
		// 根据 min 和 max 计算各个标记点的值
		let prev = 0;
		const scale = (props.max! - props.min!) / 100;
		if (props.marks && props.marks.length > 0) {
			setMarks(
				props.marks
					.sort((a, b) => a[0] - b[0])
					.map(v => {
						const offset = (v[0] - prev) / scale; // 先取 prev，再赋值新值给 prev。
						prev = v[0];
						return [v[0], v[1], offset];
					}),
			);
		}
	});

	return (
		<div ref={el => (rootRef = el)} class={joinClass(props.palette, styles.range, props.class)} style={props.style}>
			<input
				type="range"
				min={props.min}
				max={props.max}
				step={props.step}
				value={field.getValue()}
				readOnly={props.readonly}
				classList={{
					[styles['fit-height']]: props.fitHeight,
					[styles.rounded]: props.rounded,
				}}
				ref={el => {
					inputRef = el;
					if (props.ref) {
						props.ref({
							root: () => rootRef,
							input: () => el,
						});
					}
				}}
				onwheel={wheel}
				disabled={props.disabled}
				name={field.name()}
				onChange={e => {
					if (!props.readonly && !props.disabled) {
						const v = parseFloat(e.target.value);
						field.setValue(v);
						field.setError();
					}
				}}
				onInput={e => {
					const v = parseFloat(e.target.value);
					field.setValue(v);
				}}
			/>

			<Show when={marks() && marks()!.length > 0}>
				<div class={styles.marks}>
					<For each={marks()}>
						{item => (
							<span class={styles.item} style={{ width: `${item[2]}%` }}>
								<span>{item[1]}</span>
							</span>
						)}
					</For>
				</div>
			</Show>
		</div>
	);
}
